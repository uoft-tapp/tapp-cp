class DdahsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_domain
  include DdahUpdater
  include Authorizer
  before_action :correct_applicant, only: [:student_pdf, :student_accept]
  before_action :cp_admin, only: [:can_preview, :preview, :accept, :can_send_contract, :send_contracts, :can_nag_student, :send_nag_student, :can_approve_ddah, :approve_ddah]
  before_action :either_cp_admin_instructor, only: [:index, :show, :create, :destroy, :update]
  before_action  only: [:pdf, :new_template] do
    both_cp_admin_instructor(Ddah)
  end
  before_action only: [:can_finish_ddah, :finish_ddah] do
    both_cp_admin_instructor(Ddah, :ddahs, true)
  end

  def index
    if params[:session_id]
      if params[:utorid]
        render json: get_all_ddahs(get_all_ddah_for_utorid(params[:utorid], params[:session_id]))
      else
        render json: get_all_ddahs(ddahs_from_session(params[:session_id]))
      end
    else
      if params[:utorid]
        render json: get_all_ddahs(get_all_ddah_for_utorid(params[:utorid], nil))
      else
        render json: get_all_ddahs(Ddah.all)
      end
    end
  end

  def show
    if params[:utorid]
      ddahs = id_array(get_all_ddah_for_utorid(params[:utorid]))
      if ddahs.include?(params[:id])
        ddah = Ddah.find(params[:id])
        render json: ddah.format
      else
        render status: 404, json: {status: 404}
      end
    else
      ddah = Ddah.find(params[:id])
      render json: ddah.format
    end
  end

  def create
    offer = Offer.find(params[:offer_id])
    instructor = Instructor.find_by!(utorid: params[:utorid])
    ddah = Ddah.find_by(offer_id: offer[:id])
    if !ddah
      ddah = Ddah.create!(
        offer_id: offer[:id],
        instructor_id: instructor[:id],
        optional: true,
      )
      offer.update_attributes!(ddah_status: "Created")
      render status: 201, json: ddah.to_json
    else
      render status: 404, json: {message: "Error: A DDAH already exists for this offer."}
    end
  end

  def destroy
    ddah = Ddah.find(params[:id])
    if can_modify(params[:utorid], ddah)
      ddah.allocations.each do |allocation|
        allocation.destroy!
      end
      ddah.destroy!
    else
      render status: 403, file: 'public/403.html'
    end
  end

  def update
    ddah = Ddah.find(params[:id])
    if can_modify(params[:utorid], ddah)
      update_form(ddah, params)
      render status: 200, json: {message: "DDAH was updated successfully."}
    else
      render status: 403, file: 'public/403.html'
    end
  end

  def new_template
    ddah = Ddah.find(params[:ddah_id])
    offer = Offer.find(ddah[:offer_id])
    position = Position.find(offer[:position_id])
    data = {
      name: params[:name],
      optional: ddah[:optional],
      instructor_id: ddah[:instructor_id],
      tutorial_category: ddah[:tutorial_category],
      department: ddah[:department],
      scaling_learning: ddah[:scaling_learning],
      # position_id: position[:id],
    }
    template = Template.create!(data)
    copy_allocations(template, ddah.allocations, :ddah_id, :template_id)
    template.training_ids = ddah.training_ids
    template.category_ids = ddah.category_ids
    render status: 200, json: {message: "A new template was successfully created."}
  end

  '''
    Send Mails (admin)
  '''
  def can_send_ddahs
    check_ddah_status(params[:ddahs], ["Approved", "Pending"])
  end

  def send_ddahs
    begin
      params[:ddahs].each do |id|
        ddah = Ddah.find(id)
        offer = Offer.find(ddah[:offer_id])
        if ENV['RAILS_ENV'] != 'test'
          link = "#{ENV["domain"]}#{offer[:link]}".sub!("pb", "pb/ddah")
          CpMailer.ddah_email(ddah.format,link).deliver_now!
        end
        offer.update_attributes!(ddah_status: "Pending")
        ddah.update_attributes!(send_date: DateTime.now.to_s)
      end
      render status: 200, json: {message: "You've successfully sent out all the DDAH's."}
    rescue Errno::ECONNREFUSED
      render status: 404, json: {message: "Connection Refused."}
    end
  end


  def can_nag_student
    check_ddah_status(params[:ddahs], ["Pending"])
  end

  def send_nag_student
    begin
      params[:ddahs].each do |id|
        ddah = Ddah.find(id)
        offer = Offer.find(ddah[:offer_id])
        if ENV['RAILS_ENV'] != 'test'
          link = "#{ENV["domain"]}#{offer[:link]}".sub!("pb", "pb/ddah")
          CpMailer.ddah_nag_email(ddah.format, link).deliver_now!
        end
        ddah.increment!(:nag_count, 1)
      end
      render json: {message: "You've sent the nag emails."}
    rescue Errno::ECONNREFUSED
      render status: 404, json: {message: "Connection Refused."}
    end
  end

  '''
    Set DDAH status to "Ready" (instructor)
  '''
  def can_finish_ddah
    check_ddah_status(params[:ddahs], [nil, "None", "Created"])
  end

  def finish_ddah
    params[:ddahs].each do |id|
      ddah = Ddah.find(id)
      offer = Offer.find(ddah[:offer_id])
      offer.update_attributes!(ddah_status: "Ready")
      ddah.update_attributes!(supervisor_signature: params[:signature], supervisor_sign_date: DateTime.now.to_date)
    end
    render status: 200, json: {message: "The selected DDAH's have been signed and set to status 'Ready'."}
  end

  '''
    Set DDAH status to "Approved" (admin)
  '''
  def can_approve_ddah
    check_ddah_status(params[:ddahs], ["Ready"])
  end

  def approve_ddah
    params[:ddahs].each do |id|
      ddah = Ddah.find(id)
      offer = Offer.find(ddah[:offer_id])
      offer.update_attributes!(ddah_status: "Approved")
      ddah.update_attributes!(ta_coord_signature: params[:signature], ta_coord_sign_date: DateTime.now.to_date)
    end
    render status: 200, json: {message: "The selected DDAH's have been signed and set to status 'Approved'."}
  end

  def can_preview
    check_ddah_status(params[:ddahs], ["Created", "Ready", "Approved", "Pending", "Accepted"])
  end

  def preview
    ddahs = []
    params[:ddahs].each do |id|
      ddah = Ddah.find(id).format
      ddahs.push(ddah)
    end
    generator = DdahGenerator.new(ddahs)
    send_data generator.render, filename: "ddahs.pdf", disposition: "inline"
  end

  def pdf
    ddah = Ddah.find(params[:ddah_id])
    if ddah
      get_ddah_pdf(ddah)
    else
      render status: 404, json: {message: "Error: A DDAH has not been made for this offer."}
    end
  end

  def accept
    ddah = Ddah.find(params[:ddah_id])
    accept_ddah(ddah[:offer_id])
  end

  '''
    Student-Facing
  '''
  def student_pdf
    ddah = Ddah.find_by(offer_id: params[:offer_id])
    if ddah
      get_ddah_pdf(ddah)
    else
      render status: 404, json: {message: "Error: A DDAH has not been made for this offer."}
    end
  end

  def student_accept
    accept_ddah(params[:offer_id], true, params[:signature])
  end

  private
  def can_modify(utorid, ddah)
    instructor = Instructor.find_by(utorid: utorid)
    return ddah[:instructor_id] == instructor[:id]
  end

  def get_ddah_pdf(ddah)
    generator = DdahGenerator.new([ddah.format])
    send_data generator.render, filename: "ddah.pdf", disposition: "inline"
  end

  def accept_ddah(offer_id, student = false, signature = nil)
    offer = Offer.find(offer_id)
    if offer[:ddah_status] == "Accepted"
      render status: 404, json: {message: "Error: You have already accepted this DDAH.", status: offer[:ddah_status]}
    else
      ddah = Ddah.find_by(offer_id: offer_id)
      if ddah
        if student
          accept_student_ddah(ddah, offer, signature, DateTime.now.to_date)
        else
          offer.update_attributes!(ddah_status: "Accepted")
          ddah.update_attributes!(student_signature: signature, student_sign_date:  DateTime.now.to_date)
          render status: 200, json: {message: "You have accepted this DDAH.", status: offer[:ddah_status]}
        end
      else
        render status: 404, json: {message: "Error: DDAH not found."}
      end
    end
  end

  def accept_student_ddah(ddah, offer, signature, date)
    if offer[:ddah_status] == "Pending"
      offer.update_attributes!(ddah_status: "Accepted")
      ddah.update_attributes!(student_signature: signature, student_sign_date: date)
      render status: 200, json: {message: "You have accepted this DDAH.", status: offer[:ddah_status]}
    else
      render status: 404, json: {message: "Error: You cannot accept an unsent DDAH.", status: offer[:ddah_status]}
    end
  end

  def get_all_ddahs(ddahs)
    ddahs.map do |ddah|
      ddah.format
    end
  end

  def get_all_ddah_for_utorid(utorid, session = nil)
    ddahs = []
    all_ddahs = (session) ? ddahs_from_session(session) : Ddah.all
    all_ddahs.each do |ddah|
      offer = Offer.find(ddah[:offer_id])
      position = Position.find(offer[:position_id])
      position.instructors.each do |instructor|
        if instructor[:utorid] == utorid
          ddahs.push(ddah)
        end
      end
    end
    return ddahs
  end

  def check_ddah_status(ddahs, status)
    invalid = []
    ddahs.each do |ddah_id|
      ddah = Ddah.find(ddah_id)
      offer = Offer.find(ddah[:offer_id])
      if !(status.include? offer[:ddah_status])
        invalid.push(ddah[:id])
      end
    end
    if invalid.length > 0
      render status: 404, json: {invalid_offers: invalid}
    end
  end

  def clear_ddah(ddah)
    ddah.update_attributes!(
      optional: nil,
      instructor_id: nil,
      tutorial_category: nil,
      department: nil,
      scaling_learning: nil,
    )
    ddah.allocations.each do |allocation|
      ddah.allocation_ids = ddah.allocation_ids - [allocation[:id]]
      allocation.destroy!
    end
    ddah.training_ids = []
    ddah.category_ids = []
  end

  def copy_allocations(model, allocations, remove_attr, add_attr)
    allocations.each do |val|
      val = val.json.except(:id, remove_attr)
      val[add_attr] = model[:id]
      allocation = Allocation.create!(val)
      model.allocations.push(allocation)
    end
  end

  def set_domain
    ENV["domain"] = request.base_url
  end

end
