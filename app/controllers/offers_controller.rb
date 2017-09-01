class OffersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_domain
  include Mangler
  include Authorizer
  before_action :cp_access, except: [:get_contract_mangled, :set_status_mangled]
  before_action :correct_applicant, only: [:get_contract_mangled, :set_status_mangled]

  def index
    render json: get_all_offers
  end

  def show
    offer = Offer.find(params[:id])
    render json: offer.format
  end

  def can_hr_update
    offers_accepted(params[:offers])
  end

  def can_ddah_update
    offers_accepted(params[:offers])
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

  def can_send_contract
    invalid = []
    params[:contracts].each do |offer_id|
      offer = Offer.find(offer_id)
      if offer[:send_date]
        invalid.push(offer[:id])
      end
    end
    if invalid.length > 0
      render status: 404, json: {invalid_offers: invalid}
    end
  end

  def send_contracts
    params[:offers].each do |id|
      offer = Offer.find(id)
        if ENV['RAILS_ENV'] != 'test'
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
        end
        offer.update_attributes!({status: "Pending", send_date: DateTime.now.to_s})
    end
    render status: 200, json: {message: "You've successfully sent out all the contracts."}
  end

  def can_nag
    invalid = []
    params[:contracts].each do |offer_id|
      offer = Offer.find(offer_id)
      if offer[:status] != "Pending"
        invalid.push(offer[:id])
      end
    end
    if invalid.length > 0
      render status: 404, json: {invalid_offers: invalid}
    end
  end

  def batch_email_nags
    params[:contracts].each do |id|
      offer = Offer.find(id)
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
    end
    render json: {message: "You've sent the nag emails."}
  end

  def can_print
    offers_accepted(params[:contracts])
  end

  def combine_contracts_print
    offers = []
    params[:contracts].each do |offer_id|
      if params[:update]
        update_print_status(offer_id)
      end
      offer = Offer.find(offer_id)
      offers.push(offer.format)
    end
    generator = ContractGenerator.new(offers, true)
    send_data generator.render, filename: "contracts.pdf", disposition: "inline"
  end

  '''
    Gets the applicant version of the contract on the admin side.
  '''
  def get_contract
    get_contract_pdf(params)
  end

  '''
    Gets the applicant version of the contract through mangled route for the applicant
    side.
  '''
  def get_contract_mangled
    offer_id = get_offer_id(params[:mangled])
    get_contract_pdf({offer_id: offer_id})
  end

  '''
    Sets the offer status as either `Accepted` or `Rejected`. An applicant
    can`t set the offer into any other status. This action is for the applicant
    and it uses a mangled route so that an attacker can`t easily make the decision
    for the offers of other applicant.
  '''
  def set_status_mangled
    offer_id = get_offer_id(params[:mangled])
    if params[:status] == "accept" || params[:status]== "reject"
      status_setter({offer_id: offer_id, status: params[:status]})
    else
      render status: 404, json: {success: false, message: "Error: no permission to set such status"}
    end
  end

  '''
    Sets the offer status as either `Accepted`, `Rejected`, or `Withdrawn`. This
    action is for the admin.
  '''
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

  def update_print_status(offer_id)
    offer = Offer.find(offer_id)
    if offer[:hr_status] == "Processed"
      offer.update_attributes!({print_time: DateTime.now})
    else
      offer.update_attributes!({hr_status: "Printed", print_time: DateTime.now})
    end
  end

  '''
    Sets the status of an offer to either `Accepted`, `Rejected`, or `Withdrawn`
  '''
  def status_setter(params)
    status = get_status(params)
    offer = Offer.find(params[:offer_id])
    if offer[:status] == "Unsent"
      render status: 404, json: {success: false, message: "You cannot #{status[:action]} an unsent offer."}
    else
      update_status(offer, status)
      render json: {success: true, status: status[:name].downcase, message: "You've just #{status[:name].downcase} this offer."}
    end
  end

  def update_status(offer, status)
    if status[:action]=="accept"
      offer.update_attributes!({status: status[:name], signature: status[:signature], accept_date: DateTime.now})
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

  '''
    Gets the applicant version of the contract.
  '''
  def get_contract_pdf(params)
    offer = Offer.find(params[:offer_id])
    generator = ContractGenerator.new([offer.format])
    send_data generator.render, filename: "contract.pdf", disposition: "inline"
  end

  def set_domain
    ENV["domain"] = request.base_url
  end

  def offers_accepted(offers)
    invalid = []
    offers.each do |offer_id|
      offer = Offer.find(offer_id)
      if offer[:status] != "Accepted"
        invalid.push(offer[:id])
      end
    end
    if invalid.length > 0
      render status: 404, json: {invalid_offers: invalid}
    end
  end

end
