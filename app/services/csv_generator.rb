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
        msg: "Warning: There are currenly no offers for this session. Operation aborted"}
    else
      attributes = [
        "last_name",
        "first_name",
        "utorid",
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

  def generate_ddahs(session_id, position_id)
    position = Position.find(position_id)
    if position
      set_all_offer_in_session(session_id, position)
      if @offers.size == 0
        return {generated: false,
          msg: "Warning: There are currenly no offers for this position. Operation aborted"}
      else
        data = get_ddahs(position)
        return {generated: true, data: data, file: "#{position[:position]}_ddahs.csv", type: "text/csv"}
      end
    else
      return {generated: false, msg: "Warning: There is no such position"}
    end
  end

  private
  def set_all_offer_in_session(session_id, position = nil)
    session = Session.find(session_id)
    @offers = []
    Offer.all.each do |offer|
      offer = offer.format
      if offer[:session] == session
        if !position
          @offers.push(offer)
        elsif offer[:position] == position[:position]
          @offers.push(offer)
        end
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
          offer[:applicant][:utorid],
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

  def get_ddahs(position)
    setup = [
      ["supervisor_utorid",""],
      ["course_name", position[:position]],
      ["round_id", position[:round_id]],
      [],
      ["duties_list", "", "", "traingings_list", "", "", "categories_list"],
    ]
    setup = setup + get_ddah_legends + [[""]]
    data = CSV.generate do |csv|
      setup.each do |line|
        csv << line
      end
      @offers.each_with_index do |offer,index|
        ddah = Ddah.find_by(offer_id: offer[:id])
        ddah_setup = get_ddah_setup(offer,index)
        ddah_setup.each do |line|
          csv << line
        end
      end
    end
  end

  def get_ddah_legends
    duties = Duty.all
    trainings = Training.all
    categories = Category.all
    legends = []
    duties.each_with_index do |duty, index|
      legends.push([duty[:name], index, "", "", "", "", ""])
      num = index+1
      if index < trainings.length
        legends[index][3] = trainings[index][:name]
        legends[index][4] = num_to_alpha(num)
      end
      if index < categories.length
        legends[index][6] = categories[index][:name]
        legends[index][7] = num_to_alpha(num)
      end
    end
    return legends
  end

  def get_ddah_setup(offer, index)
    ddah = Ddah.find_by(offer_id: offer[:id])
    curr = 13+(index*6)
    setup = [
      ["applicant_name", "utorid", "required hours", "trainings", "allocations", "id(generated)"],
      ["#{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}", offer[:applicant][:utorid], offer[:hours], "", "", "num_units"],
      ["", "", "total_hours (generated)", "categories", "", "unit_name"],
      ["", "", "=TEXT(SUM(G#{curr+5}:AD#{curr+5}), \"0.00\")", "", "", "duty_id"],
      ["", "", "", "", "", "minutes"],
      ["", "", "", "", "", "hours (generated)"],
    ]
    setup.each_with_index do |line, index|
      for num in 1..24
        num = num + 6
        if index == (setup.length - 1)
          line.push("=(#{num_to_alpha(num)}#{curr+1}*#{num_to_alpha(num)}#{curr+4})/60")
        else
          line.push("")
        end
      end
    end
    return setup
  end

  def num_to_alpha(num)
    alpha26 = ("a".."z").to_a
    return "" if num < 1
    s, q = "", num
    loop do
      q, r = (q - 1).divmod(26)
      s.prepend(alpha26[r])
      break if q.zero?
    end
    s
  end
end
