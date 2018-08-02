class ImportController < ApplicationController
  # protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  include Authorizer
  before_action :cp_access, only: [:import_offers, :import_locked_assignments]
  before_action :tapp_admin, only: [:chass, :enrolment, :instructors]
  before_action :cp_admin, only: [:ddahs, :templates]

  def import_offers
    importer = OfferImporter.new
    status = importer.import_json(params[:chass_offers])
    import_helper(status)
  end

  def import_locked_assignments
    importer = OfferImporter.new
    importer.import_assignments()
    render json: {errors: false}
  end

  def chass
    import = ChassImporter.new(params[:chass_json], params[:semester], params[:year])
    status = import.get_status
    import_helper(status)
  end

  def enrolment
    updater = EnrolmentUpdater.new(params[:enrolment_data])
    status = updater.get_status
    import_helper(status)
  end

  def instructors
    importer = InstructorImporter.new
    importer.import_instructors(params[:instructor_data])
    render json: {errors: false}
  end

  def ddahs
    importer = DdahImporter.new
    status = importer.import_ddahs(params[:ddah_data])
    import_helper(status)
  end

  def templates
    importer = DdahImporter.new
    status = importer.import_template(params[:ddah_data])
    import_helper(status)
  end

  private
  def import_helper(status)
    if status[:success]
      render json: {errors: status[:errors], message: status[:message]}
    else
      render status: 404, json: {message: status[:message], errors: status[:errors]}
    end
  end


end
