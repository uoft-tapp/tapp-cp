class ImportController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access, only: [:import_offers, :import_locked_assignments]
  before_action :tapp_admin, only: [:chass, :enrollment]

  def import_offers
    importer = OfferImporter.new
    status = importer.import_json(params[:chass_offers])
    if status[:imported]
      render json: {message: status[:message], errors: status[:errors]}
    else
      render status: 404, json: {message: status[:message], errors: status[:errors]}
    end
  end

  def import_locked_assignments
    importer = OfferImporter.new
    importer.import_assignments()
    render json: {errors: false, message: ["Importing locked assignments as offers was successful."]}}
  end

  def chass
    import = ChassImporter.new(params[:chass_json], params[:semester], params[:year])
    status = import.get_status
    if status[:success]
      render json: {message: status[:message], errors: status[:errors]}
    else
      render status: 404, json: {message: status[:message], errors: status[:errors]}
    end
  end

  def enrollment
    updater = EnrollmentUpdater.new(params[:enrollment_data])
    status = updater.get_status
    if status[:updated]==true
      render json: {message: status[:message]}
    else
      render status: 404, json: {message: status[:message]}
    end
  end

end
