class ImportController < ApplicationController
  protect_from_forgery with: :null_session

  def import_offers
    importer = OfferImporter.new
    importer.import_json(params[:chass_offers])
  end

  def import_locked_assignments
    importer = OfferImporter.new
    importer.import_assignments()
  end

  def chass
    import = ChassImporter.new(params[:chass_json], params[:semester], params[:year])
    status = import.get_status
    if status[:success]
      render json: {message: status[:message], imported: status[:imported]}
    else
      render status: 404, json: {message: status[:message], imported: status[:imported]}
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
