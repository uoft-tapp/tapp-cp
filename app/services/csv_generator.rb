class CSVGenerator
  require 'csv'

  def initialize
    @assignments = Assignment.all.includes([:position, :applicant])
    @applicants = Applicant.all.includes([:applications])
    @courses = {}
  end

  def generate_cdf_info
    if @assignments.size == 0
      return {generated: false,
        msg: "Warning: You have not made any assignments. Operation aborted."}
    else
      attributes = [
        "course_code",
        "email_address",
        "studentnumber",
        "familyname",
        "givenname",
        "student_department",
        "utorid",
      ]
      data = get_cdf_info(attributes)
      return {generated: true, data: data, file: "cdf_info.csv", type: "text/csv"}
    end
  end

  def generate_offers
    if @assignments.size == 0
      return {generated: false,
        msg: "Warning: You have not made any assignments. Operation aborted."}
    else
      attributes = [
        "course_code",
        "course_title",
        "offer_hours",
        "student_number",
        "familyname",
        "givenname",
        "utorid",
        "student_status",
        "student_department",
        "email_address",
        "round_id",
      ]
      data = get_offers(attributes)
      return {generated: true, data: data, file: "offers.csv", type: "text/csv"}
    end
  end

  def generate_transcript_access
    if @applicants.size == 0
      return {generated: false,
        msg: "Warning: There are currenly no applicant in the system. Operation aborted"}
    else
      attributes = [
        "student_number",
        "familyname",
        "givenname",
        "grant",
        "email_address"
      ]
      data = get_transcript_access(attributes)
      return {generated: true, data: data, file: "transcript_access.csv", type: "text/csv"}
    end
  end

  def generate_cp_offers(session_id)
    set_all_offer_in_session(session_id)
    if @offers.size == 0
      return {generated: false,
        msg: "Warning: There are currenly no offers in the system. Operation aborted"}
    else
      attributes = [
        "last_name",
        "first_name",
        "email",
        "student_number",
        "position",
        "hours",
        "status",
        "contract_send_date",
        "nag_count",
        "hris_status",
        "print_date",
        "ddah_status",
      ]
      data = get_cp_offers(attributes)
      return {generated: true, data: data, file: "cp_offers.csv", type: "text/csv"}
    end
  end

  private
  def set_all_offer_in_session(session_id)
    session = Session.find(session_id)
    @offers = []
    Offer.all.each do |offer|
      offer = offer.format
      if offer[:session] == session
        @offers.push(offer)
      end
    end
  end

  def get_cdf_info(attributes)
    data = CSV.generate do |csv|
      csv << attributes
      @assignments.each do |assignment|
        course = assignment.position
        applicant = assignment.applicant
        csv << [
          course[:position],
          applicant[:email],
          applicant[:student_number],
          applicant[:last_name],
          applicant[:first_name],
          applicant[:dept],
          applicant[:utorid],
        ]
      end
    end
    return data
  end

  def get_offers(attributes)
    data = CSV.generate do |csv|
      csv << attributes
      @assignments.each do |assignment|
        course = assignment.position
        applicant = assignment.applicant
        course_code = course[:position]
        csv << [
          course[:position],
          course[:course_name],
          assignment[:hours].to_s,
          applicant[:student_number].to_s,
          applicant[:last_name],
          applicant[:first_name],
          applicant[:utorid],
          get_status(applicant[:program_id]),
          applicant[:dept],
          applicant[:email],
          course[:round_id].to_s,
        ]
      end
    end
    return data
  end

  def get_status(program_id)
    case program_id
    when '7PDF'
      return 'PostDoc'
    when '1PHD'
      return 'PhD'
    when '2Msc'
      return 'MSc'
    when '4MASc'
      return 'MASc'
    when '8UG'
      return 'UG'
    when '3MScAC'
        return 'MScAC'
    when '5MEng'
        return 'MEng'
    when '6Other'
        return 'OG'
    else
      return 'Other'
    end
  end

  def get_transcript_access(attributes)
    data = CSV.generate do |csv|
      csv << attributes
      @applicants.each do |applicant|
        application =  applicant.applications[0]
        csv << [
          applicant[:student_number],
          applicant[:last_name],
          applicant[:first_name],
          application[:access_acad_history].downcase,
          applicant[:email],
        ]
      end
    end
    return data
  end

  def get_cp_offers(attributes)
    data = CSV.generate do |csv|
      csv << attributes
      @offers.each do |offer|
        csv << [
          offer[:applicant][:last_name],
          offer[:applicant][:first_name],
          offer[:applicant][:email],
          offer[:applicant][:student_number],
          offer[:position],
          offer[:hours],
          offer[:status],
          offer[:send_date],
          offer[:nag_count],
          offer[:hr_status],
          offer[:print_time],
          offer[:ddah_status],
        ]
      end
    end
    return data
  end
end
