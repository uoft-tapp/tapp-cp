class OfferImporter
  include Importer

  def import_json(file)
    exceptions = []
    file[:offers].each do |offer|
      position = Position.find_by(position: offer["course_id"], round_id: offer["round_id"])
      applicant = Applicant.find_by(utorid: offer["utorid"])
      if position && applicant
        ident = {position_id: position[:id], applicant_id: applicant[:id]}
        exists = "offer with position #{offer[:position]} for applicant #{offer[:utorid]} already exists"
        data = get_data(position, applicant, offer["hours"],offer["session"], offer["year"])
        insertion_helper(Offer, data, ident, exists)
      else
        exceptions.push("Error: either Position #{offer["course_id"]} or Applicant #{offer["utorid"]} is invalid.")
      end
    end
    if exceptions.length == file[:offers].length
      return {success: false, errors: true, message: exceptions}
    elsif exceptions.length > 0
      return {success: true, errors: true, message: exceptions}
    else
      return {success: true, errors: false, message: ["Offers import was successful."]}
    end
  end

  def import_assignments
    Assignment.all.each do |assignment|
      if assignment[:export_date]
        position = Position.find(assignment[:position_id])
        applicant = Applicant.find(assignment[:applicant_id])
        session = Session.find(position[:session_id])

        ident = {position_id: position[:id], applicant_id: assignment[:applicant_id]}
        exists = "offer with position #{position[:position]} for applicant #{applicant[:utorid]} already exists"
        data = get_data(position, applicant, assignment[:hours], session[:semester], session[:year])
        insertion_helper(Offer, data, ident, exists)
      end
    end
  end

  private
  def get_data(position, applicant, hours, session, year)
    {
      position_id: position[:id],
      applicant_id: applicant[:id],
      hours: hours,
      session: session,
      year: year,
    }
  end

end
