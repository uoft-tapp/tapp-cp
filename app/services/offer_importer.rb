class OfferImporter
  def initialize(data)
    @offers = data[:offers]
  end

  def import_data
    @offers.each do |offer|
      position = Position.find_by_position(offer["course_id"], offer["round_id"])
      applicant = Applicant.find_by_utorid(offer["utorid"])
      ident = {position_id: position[:id], applicant_id: applicant[:id]}
      exists = "offer with position #{offer[:position]} for applicant #{offer[:utorid]} already exists"
      data = {
        position_id: position[:id],
        applicant_id: applicant[:id],
        hours: offer["hours"],
        session: offer["session"],
        year: offer["year"],
      }
      insertion_helper(Offer, data, ident, exists)
    end
  end

  private
  def insertion_helper(model, data, ident, exists)
    unless model.where(ident).exists?
      db_model = model.create(data)
      Rails.logger.debug "new #{JSON.pretty_generate(db_model.as_json)}\n\n"
      db_model.save!
      return db_model
    else
      Rails.logger.debug "#{exists}"
      db_model = model.find_by(ident)
      Rails.logger.debug "existing model #{JSON.pretty_generate(db_model.as_json)}\n"
      db_model.update_attributes(data)
      Rails.logger.debug "update model #{exists}\nupdate to #{JSON.pretty_generate(db_model.as_json)}\n\n"
      db_model.save!
      return db_model
    end
  end

end
