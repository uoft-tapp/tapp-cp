class ImportController < ApplicationController
  protect_from_forgery with: :null_session

  def import_offers
    importer = OfferImporter.new(params[:chass_offers])
    importer.import_data
  end
end
