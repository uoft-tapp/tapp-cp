class ChassImporter
  attr_reader :course_data, :applicant_data, :round_id

  def initialize(data, semester, year)
    @course_data = data["courses"]
    @applicant_data = data["applicants"]
    @round_id = get_round_id
    @exceptions = []
    if @round_id[:found]
      @round_id = @round_id[:round_id]
      create_session(semester, year)
      insert_data
    else
      @import_status = {success: false, errors: true, message: [@round_id[:message]]}
    end
  end

  def get_status
    if @exceptions.length > 0
      {success: true, errors: true, message: @exceptions}
    else
      @import_status
    end
  end

  private
  def insert_data
    insert_positions
    insert_applicant
    insert_application
    @import_status = {success: true, errors: false, message: ["CHASS import completed."]}
  end

  def get_round_id
    round_ids = @course_data.map { |course_entry| course_entry["round_id"] }.uniq
    case round_ids.length
    when 0
      return {found: false, message: "Import Failure: no round_id found in the file"}
    when 1
      if round_ids[0]
        return {found: true, round_id: round_ids.first}
      else
        return {found: false, message: "Import Failure: no round_id found in the file"}
      end
    else
      return {found: false, message: "Import Failure: too many round_ids found in the file"}
    end
  end

  def insertion_helper(model, data, ident, exists)
    unless model.where(ident).exists?
      db_model = model.create!(data)
      Rails.logger.debug "new #{JSON.pretty_generate(db_model.as_json)}\n\n"
      db_model.save!
      return db_model
    else
      Rails.logger.debug "#{exists}"
      db_model = model.find_by(ident)
      Rails.logger.debug "existing model #{JSON.pretty_generate(db_model.as_json)}\n"
      db_model.update_attributes!(data)
      Rails.logger.debug "update model #{exists}\nupdate to #{JSON.pretty_generate(db_model.as_json)}\n\n"
      db_model.save!
      return db_model
    end
  end

  def create_session(semester, year)
    semester = semester.slice(0,1).upcase + semester.slice(1..-1).downcase
    data ={
        year: year,
        semester: semester,
    }
    exists = "Session #{semester}, #{:year} already exists"
    ident = {year: data[:year], semester: data[:semester]}
    @session = insertion_helper(Session, data, ident, exists)
  end

  def insert_applicant
    @applicant_data.each do |applicant_entry|
      utorid = applicant_entry["utorid"]
      ident = {utorid: utorid}
      exists = "applicant #{utorid} already exists"
      data = {
          utorid: utorid,
          app_id: applicant_entry["app_id"].to_i,
          student_number: applicant_entry["student_no"],
          first_name:applicant_entry["first_name"],
          last_name: applicant_entry["last_name"],
          email:applicant_entry["email"],
          phone: applicant_entry["phone"],
          dept: applicant_entry["dept"],
          program_id: applicant_entry["program_id"],
          yip: applicant_entry["yip"],
          address:applicant_entry["address"],
          commentary: "",
          full_time: applicant_entry["full_time"],
      }
      insertion_helper(Applicant, data, ident, exists)
    end
  end

    def insert_application
      @applicant_data.each do |applicant_entry|
        applicant = Applicant.where(utorid: applicant_entry["utorid"]).take!

        app_id = applicant_entry["app_id"].to_i
        ident = {round_id: @round_id}
        exists = "application #{app_id}, from round #{round_id} already exists"

        data = {
          round_id: @round_id,
          ta_training: applicant_entry["ta_training"],
          access_acad_history: applicant_entry["access_acad_history"],
          ta_experience: applicant_entry["ta_experience"],
          academic_qualifications: applicant_entry["academic_qualifications"],
          technical_skills: applicant_entry["technical_skills"],
          availability: applicant_entry["availability"],
          other_info: applicant_entry["other_info"],
          special_needs: applicant_entry["special_needs"],
          raw_prefs: applicant_entry["course_preferences"]
        }
        application = insertion_helper(applicant.applications, data, ident, exists)

        appliedFor = []
        applicant_entry["courses"].each do |position|
          position_ident = {position: position, round_id: @round_id}
          position_row = Position.where(position_ident).select(:id).take

          if position_row
            position_id = position_row.id
            appliedFor.push(position_id)
            pref_ident = {position_id: position_id}
            pref_exists = "preference with application #{application[:id]} & position #{position_id} already exists"
            data = {
              position_id: position_id,
              rank: 2
            }
            insertion_helper(application.preferences, data, pref_ident, exists)
          end
        end
        insert_preference(applicant_entry["course_preferences"], application)

        Preference.where({application_id: application[:id]}).each do |position|
          if !appliedFor.include?(position[:position_id])
            Preference.find_by({application_id: application[:id], position_id: position[:position_id]}).destroy
            Rails.logger.debug "delete Preference with Application #{application[:id]} and Position #{position[:position_id]}"
          end
        end

      end
    end

  def insert_preference(preferences, application)
    prefs = parse_preference(preferences)
    mapping = get_pref_mapping(application)
    if prefs
      prefs.each do |preference|
        preference=preference.strip
        if preference.size>1
          pref = get_pref(mapping, preference.downcase)
          if pref
            pref.update(rank: 1)
          end
        end
      end
    end
  end

  def get_pref(mapping, parsed_data)
    mapping.each do |key|
      if parsed_data.include? key[0]
        return Preference.find(key[1])
      end
    end
    return false
  end

  def get_pref_mapping(application)
    mapping = {}
    Preference.where({application_id: application[:id]}).each do |preference|
      position = Position.find(preference[:position_id])
      id = preference[:id]
      code = position[:position].downcase
      split_code = code.split("/")
      name = position[:course_name].downcase
      mapping[code] = id
      mapping[name] = id
      mapping[split_code[0]] = id #i.e. in CSC142H1S/2400H1S, the part before slash
      mapping[code[/[a-z0-9]{3}\d{3,4}/]] = id #i.e. csc108
      mapping[code[/\d{3,4}/]] = id #i.e. 108
      mapping[code[/[a-z0-9]{3}\d{3,4}[a-z0-9]/]] = id #i.e. csc108h
      if code[/[a-z0-9]{3}\d{3,4}[a-z0-9]\d/] #i.e. csc108h1
        mapping[code[/[a-z0-9]{3}\d{3,4}[a-z0-9]\d/]] = id #i.e. csc108h1
      end
      if code[/[a-z0-9]{3}\d{3,4}[a-z0-9]\d[a-z]/] #i.e. csc108h1s
        mapping[code[/[a-z0-9]{3}\d{3,4}[a-z0-9]\d[a-z]/]] = id #i.e. csc108h1s
      end
      if name.include? code[/[a-z0-9]{3}\d{3,4}/] #i.e. in course name: "Learning a subject csc108" a course code exists
        index = name.index(code[/[a-z0-9]{3}\d{3,4}/])-1 #takes index of course code in course name
        mapping[name[0..index].strip] = id #remove course code from course name and assign course name (without course code) to id
      end
      if split_code.size > 1 #i.e. in CSC142H1S/2400H1S, the part after slash exists
        mapping[split_code[1]] = id #i.e. 2400H1S
        mapping[split_code[1][/\d{3,4}/]] = id #i.e. 2400
        mapping[split_code[0][/[a-z0-9]{3}/]+split_code[1]] = id #i.e. CSC2400H1S
        mapping[split_code[0][/[a-z0-9]{3}/]+split_code[1][/\d{3,4}/]] = id #i.e. CSC2400
      end
    end
    return mapping
  end

  def parse_preference(pref)
    list = pref.split(/[.,'&;\r\n():\t]/)
    list.each do |list_item|
      if list_item.include?"and"
        temp = list_item.split(/and/)
        temp.each do |item|
          list.push(item)
        end
      end
      if list_item.include?"or"
        temp = list_item.split(/or/)
        temp.each do |item|
          list.push(item)
        end
      end
    end
    return list
  end

  def insert_positions
    @course_data.each do |course_entry|
      posting_id  = course_entry["course_id"]
      course_id = posting_id.split("-")[0].strip
      round_id = course_entry["round_id"]
      dates = get_dates(course_entry["dates"])
      if !dates
        dates = [nil, nil]
        @exceptions.push("Error: The dates for Position #{course_entry["course_id"]} is malformed.")
      end
      exists = "Position #{posting_id} already exists"
      ident = {position: posting_id, round_id: round_id}
      data = {
        position: posting_id,
        round_id: round_id,
        open: true,
        campus_code: course_id[course_id[/[A-Za-z0-9]{3}\d{3,4}/].size+1].to_i,
        course_name: course_entry["course_name"].strip,
        current_enrollment: course_entry["enrollment"],
        duties: course_entry["duties"],
        qualifications: course_entry["qualifications"],
        hours: course_entry["n_hours"],
        estimated_count: course_entry["n_positions"],
        estimated_total_hours: course_entry["total_hours"],
        session_id: @session[:id],
        start_date: dates[0],
        end_date: dates[1],
      }
      position = insertion_helper(Position, data, ident, exists)

      teaching_instructors = []
      course_entry["instructor"].each do |instructor|
        name = instructor["first_name"].strip+" "+instructor["last_name"].strip
        ident = {name: name}
        exists = "Instructor #{name} alread exists"
        data = {
            name: name,
            email: instructor["email"],
            utorid: instructor["utorid"],
        }
        instructor = insertion_helper(Instructor, data, ident, exists)
        teaching_instructors.push(instructor[:id])
        unless position.instructors.where(id: instructor[:id]).exists?
          position.instructors << [instructor]
        end
      end
      position.instructors.each do |instructor|
        if !teaching_instructors.include?(instructor[:id])
          position.instructors.delete(instructor)
          Rails.logger.debug "all instructors for Position #{position[:id]}: #{JSON.pretty_generate(position.instructors.as_json)}"
        end
      end
    end
  end

  def get_dates(dates)
    if dates
      dates = dates.split(" to ")
      if dates.size == 2
        return dates
      else
        dates = dates[0].split(" - ")
        if dates.size == 2
          return dates
        end
      end
    end
  end


end
