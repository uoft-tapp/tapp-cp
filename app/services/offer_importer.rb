class OfferImporter
  def initialize(file)
    data = File.read("#{Rails.root}/db/seeds/#{file}.json")
    raise JSON::ParserError.new("the source file is empty") if data.strip.length == 0
    @offers = JSON.parse(data).fetch("offers")
  end

  def import_data
    @offers.each do |offer|
      position = Position.find_by_position(offer["course_id"], offer["round_id"])
      applicant = Applicant.find_by_utorid(offer["utorid"])
      offer = Offer.create!(
        position_id: position[:id],
        applicant_id: applicant[:id],
        hours: offer["hours"],
        session: offer["session"],
        year: offer["year"],
      )
      offer.save!
    end
  end
end
