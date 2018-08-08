class OffersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_domain
  include Authorizer
  before_action :cp_admin, except: [:index, :show, :get_contract_student, :set_status_student,
                                    :can_print, :combine_contracts_print, :applicant_get_offers]
  before_action :correct_applicant, only: [:get_contract_student, :set_status_student]
  before_action only: [:get_contract_pdf, :get_contract, :can_print, :combine_contracts_print] do
   cp_admin(true)
  end
  before_action only: [:index, :show] do
    either_cp_admin_instructor(true)
  end
  before_action :applicant, only: [:applicant_get_offers]

  def index
    if params[:session_id]
      if params[:utorid]
        render json: get_all_offers_for_utorid(params[:utorid], params[:session_id])
      else
        render json: get_all_offers(offers_from_session(params[:session_id]))
      end
    else
      if params[:utorid]
        render json: get_all_offers_for_utorid(params[:utorid], nil)
      else
        render json: get_all_offers(Offer.all)
      end
    end
  end

  def show
    if params[:utorid]
      offers = id_array(get_all_offers_for_utorid(params[:utorid], nil))
      if offers.include?(params[:id])
        offer = Offer.find(params[:id])
        render json: offer.instructor_format
      else
        render status: 404, json: {status: 404}
      end
    else
      offer = Offer.find(params[:id])
      render json: offer.format
    end
  end

  def applicant_get_offers
    offers = []
    all_offers = Offer.all
    all_offers.each do |offer|
      applicant = Applicant.find(offer[:applicant_id])
      if applicant[:utorid] == params[:utorid]
        offers.push(offer.format)
      end
    end
    render json: offers
  end

  # can update HR status for offers that are accepted or pending
  def can_hr_update
    check_offers_status(params[:offers], :status, ["Accepted", "Pending"])
  end

  # can update DDAH status for offers that are accepted or pending
  def can_ddah_update
    check_offers_status(params[:offers], :status, ["Accepted", "Pending"])
  end

  # can send contracts for offers that are unsent or pending
  def can_send_contract
    check_offers_status(params[:offers], :status, ["Unsent", "Pending"])
  end

  # can nag for offers that are pending
  def can_nag
    check_offers_status(params[:offers], :status, ["Pending"])
  end

  # can print contracts for offers that are pending, accepted, or rejected
  def can_print
    check_offers_status(params[:offers], :status, ["Pending", "Accepted", "Rejected"])
  end

  def can_clear_hris_status
    check_offers_status(params[:offers], :hr_status, [nil, "Processed", "Printed"])
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
    begin
      params[:offers].each do |id|
        offer = Offer.find(id)
        if ENV['RAILS_ENV'] != 'test'
          offer.update_attributes!(link: "/pb/#{offer[:id]}")
          CpMailer.contract_email(offer.format, "#{ENV["domain"]}#{offer[:link]}").deliver_now!
        end
        offer.update_attributes!({status: "Pending", send_date: DateTime.now.to_s})
      end
      render status: 200, json: {message: "Contracts successfully sent."}
    rescue Errno::ECONNREFUSED
      puts "rejected"
      render status: 404, json: {message: "Connection refused."}
    end
  end

  def batch_email_nags
    begin
      params[:offers].each do |id|
        offer = Offer.find(id)
        offer.increment!(:nag_count, 1)
        if ENV['RAILS_ENV'] != 'test'
          CpMailer.nag_email(offer.format, "#{ENV["domain"]}#{offer[:link]}").deliver_now!
        end
      end
      render json: {message: "You've sent the nag emails."}
    rescue Errno::ECONNREFUSED
      render status: 404, json: {message: "Connection refused."}
    end
  end

  '''
    Nag Mails (admin)
  '''
  def can_nag_instructor
    invalid = []
    params[:offers].each do |offer_id|
      offer = Offer.find(offer_id)
      instructors = offer.format[:instructors]
      if !(["None", "Created"].include? offer[:ddah_status]) || instructors.length == 0
        invalid.push(offer[:id])
      end
    end
    if invalid.length > 0
      render status: 404, json: {invalid_offers: invalid}
    end
  end

  def send_nag_instructor
    begin
      params[:offers].each do |id|
        offer = Offer.find(id)
        instructors = offer.format[:instructors]
        offer.increment!(:ddah_nag_count, 1)
        if ENV['RAILS_ENV'] != 'test'
          instructors.each do |instructor|
            CpMailer.instructor_nag_email(offer.format, instructor).deliver_now!
          end
        end
      end
      render status: 200, json: {message: "You've successfully sent out all the nag emails."}
    rescue Errno::ECONNREFUSED
      render status: 404, json: {message: "Connection refused."}
    end
  end

  def combine_contracts_print
    offers = []
    params[:offers].each do |offer_id|
      if params[:update]
        update_print_status(offer_id)
      end
      offer = Offer.find(offer_id)
      offers.push(offer.format)
    end
    generator = ContractGenerator.new(offers, true)
    send_data generator.render, filename: "contracts.pdf", disposition: "inline"
  end

  def get_contract
    get_contract_pdf(params)
  end

  def get_contract_student
    get_contract_pdf(params)
  end

  def set_status_student
    if params[:status] == "accept" || params[:status]== "reject"
      status_setter({offer_id: params[:offer_id], status: params[:status]})
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

  def clear_hris_status
    params[:offers].each do |id|
      offer = Offer.find(id)
      offer.update_attributes!(hr_status: nil, print_time: nil)
    end
  end

  def accept_offer
    offer = Offer.find(params[:offer_id])
    if offer[:status]!="Unsent"
      offer.update_attributes!(status: "Accepted", accept_date: DateTime.now)
      offer = offer.format
      render status: 200, json: {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Accepted'."}
    else
      render status: 404, json: {message: "Error: You can't accept an Unsent offer."}
    end
  end

  def reset_offer
    offer = Offer.find(params[:offer_id])
    offer.update_attributes!(status: "Unsent", accept_date: nil, commentary: nil, hr_status: nil, nag_count: nil,
                             print_time: nil, send_date: nil, signature: nil)
    offer = offer.format
    render status: 200, json: {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Unsent'."}
  end

  private
  def get_contract_pdf(params)
    offer = Offer.find(params[:offer_id])
    generator = ContractGenerator.new([offer.format])
    send_data generator.render, filename: "contract.pdf", disposition: "inline"
  end

  def offer_params
    params.permit(:hr_status, :ddah_status, :commentary)
  end

  def get_all_offers(offers)
    offers.map do |offer|
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
    if status[:action] == "withdraw" || offer[:status] != "Unsent"
      update_status(offer, status)
      render json: {success: true, status: status[:name].downcase, message: "You've just #{status[:name].downcase} this offer."}
    else
      render status: 404, json: {success: false, message: "You cannot #{status[:action]} an unsent offer."}
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

  def set_domain
    ENV["domain"] = request.base_url
  end

  # check that all offers have an expected status
  # expects an array of status(es)
  def check_offers_status(offers, attr, status)
    invalid = []
    offers.each do |offer_id|
      offer = Offer.find(offer_id)
      if !(status.include? offer[attr])
        invalid.push(offer[:id])
      end
    end
    if invalid.length > 0
      render status: 404, json: {invalid_offers: invalid}
    end
  end

  def get_all_offers_for_utorid(utorid, session)
    offers = []
    all_offers = (session) ? offers_from_session(session) : Offer.all
    all_offers.each do |offer|
      position = Position.find(offer[:position_id])
      position.instructors.each do |instructor|
        if instructor[:utorid] == utorid
          offers.push(offer.instructor_format)
        end
      end
    end
    return offers
  end

end
