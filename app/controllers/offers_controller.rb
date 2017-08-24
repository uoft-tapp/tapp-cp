class OffersController < ApplicationController
  protect_from_forgery with: :null_session
  include Mangler

  def index
    render json: get_all_offers
  end

  def show
    offer = Offer.find(params[:id])
    render json: offer.format
  end

  def update
    if params[:id] == "batch-update"
      if params[:offers]
        params[:offers].each do |id|
          offer = Offer.find(id)
          offer.update_attributes!(offer_params)
        end
      else
        render status: 404, json: {message: "Error: No offers given."}
      end
    else
      offer = Offer.find(params[:id])
      offer.update_attributes!(offer_params)
    end
  end

  def send_contracts
    errors = ["Exceptions:"]
    if params[:offers]
      params[:offers].each do |id|
        offer = Offer.find(id)
        if !offer[:send_date]
          if ENV['RAILS_ENV'] != 'test'
            begin
              '''
               We create mangled, which is a hash of the data from get_utorid_position
               the data from get_utorid_position is a json that can be reused
               on the /pb/:mangled routes, where :mangled = mangled.
               This is where we mangled our routes so that an attacker can\'t
               see how to masquerade as another applicant.
               get_route(mangled) creates the link that we send to the applicant,
               so that they can see the view for making decision on whether or not
               to accept an offer.
              '''
              mangled = crypt(get_utorid_position(offer.format), id)
              offer.update_attributes!(link: mangled)
              CpMailer.contract_email(offer.format, get_route(mangled)).deliver_now
            rescue StandardError => e
              errors.push("Could not send a contract to #{offer[:applicant][:email]}.")
            end
          end
          offer.update_attributes!({status: "Pending", send_date: DateTime.now.to_s})
        else
          errors.push("You've already sent out a contract to #{offer.format[:applicant][:email]}.")
        end
      end
    end
    if errors.length == 1
      render status: 200, json: {message: "You've successfully sent out all the contracts."}
    else
      render status: 404, json: {message: errors.join("\n")}
    end
  end

  def batch_email_nags
    exceptions = ["Exceptions:"]
    if params[:contracts] && params[:contracts]!=""
      params[:contracts].each do |id|
        offer = Offer.find(id)
        if offer
          if offer[:status] == "Pending"
            offer.increment!(:nag_count, 1)
            if ENV['RAILS_ENV'] != 'test'
              '''
               We create mangled, which is a hash of the data from get_utorid_position
               the data from get_utorid_position is a json that can be reused
               on the /pb/:mangled routes, where :mangled = mangled.
               This is where we mangled our routes so that an attacker can`t
               see how to masquerade as another applicant.
               get_route(mangled) creates the link that we send to the applicant,
               so that they can see the view for making decision on whether or not
               to accept an offer.
              '''
              mangled = offer[:link]
              CpMailer.nag_email(offer.format, get_route(mangled)).deliver_now
            end
          else
            offer = offer.format
            exceptions.push("- Applicant #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s nag for Position #{offer[:position]} was not sent because it is not in Pending status.")
          end
        end
      end
      if exceptions.length == 1
        render json: {message: "You've sent the nag emails."}
      else
        render status: 404, json: {message: exceptions.join("\n")}
      end
    end
  end

  def combine_contracts_print
    if params[:contracts] && params[:contracts]!=""
      offers = get_printable_data(params[:contracts])
      if params[:update]
        update_print_status(offers)
      end
      generator = ContractGenerator.new(offers, true)
      send_data generator.render, filename: "contracts.pdf", disposition: "inline"
    end
  end

  def get_contract_pdf
    offer_id = get_offer_id(params[:mangled])
    offer = Offer.find(offer_id)
    generator = ContractGenerator.new([offer.format])
    send_data generator.render, filename: "contract.pdf", disposition: "inline"
  end

  def set_status_mangled
    offer_id = get_offer_id(params[:mangled])
    if params[:status] == "accept" || params[:status]== "reject"
      status_setter({offer_id: offer_id, status: params[:status]})
    else
      render status: 404, json: {success: false, message: "Error: no permission to set such status"}
    end
  end

  def set_status
    status_setter(params)
  end

  private
  def offer_params
    params.permit(:hr_status, :ddah_status)
  end

  def get_all_offers
    Offer.all.map do |offer|
      offer.format
    end
  end

  def get_printable_data(contracts)
    offers = []
    contracts.each do |id|
      offer = Offer.find(id)
      if offer
        offers.push(offer.format)
      end
    end
    return offers
  end

  def update_print_status(offers)
    offers.each do |offer|
      offer = Offer.find(offer[:id])
      if offer[:hr_status] == "Processed"
        offer.update_attributes!({print_time: DateTime.now})
      else
        offer.update_attributes!({hr_status: "Printed", print_time: DateTime.now})
      end
    end
  end

  '''
    Sets the status of an offer to either `Accepted`, `Rejected`, or `Withdrawn`
  '''
  def status_setter(params)
    status = get_status(params)
    offer = Offer.find(params[:offer_id])
    if offer[:status] == "Pending"
      update_status(offer, status)
      render json: {success: true, status: status[:name].downcase, message: "You've just #{status[:name].downcase} this offer."}
    elsif offer[:status] == "Unsent"
      render status: 404, json: {success: false, message: "You cannot #{status[:action]} an unsent offer."}
    else
      render status: 404, json: {success: false, message: "You cannot reject this offer. This offer has already been #{offer[:status].downcase}."}
    end
  end

  def update_status(offer, status)
    if status[:action]=="accept"
      offer.update_attributes!({status: status[:name], signature: status[:signature]})
    else
      offer.update_attributes!({status: status[:name]})
    end
  end

  def get_status(code)
    case params[:status]
    when "accept"
      return {name: "Accepted", action: "accept", signature: params[:signature]}
    when "reject"
      return {name: "Rejected", action: "reject"}
    when "withdraw"
      return {name: "Withdrawn", action: "withdraw"}
    end
  end

  def get_utorid_position(offer)
    {
      utorid: offer[:applicant][:utorid],
      position_id: offer[:position_id],
    }
  end

end
