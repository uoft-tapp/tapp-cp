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

end
