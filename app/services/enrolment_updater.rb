class EnrolmentUpdater
  def initialize(data)
    lines = data.split("\n")
    if is_valid(lines)
      parse_lines(lines)
      @status = {success: true, errors: false}
    else
      @status = {success: false, errors: true, message: ["Error: This file is not formatted correctly."]}
    end
  end

  def get_status
    @status
  end

  private
  def is_valid(lines)
    lines.each do |line|
      if line.length != 84
        return false
      else
        numbers = [line[0..5].strip, line[64..67], line[68..71], line[74..line.length-1]]
        lengths = [3, 9, 7]
        strings = [line[6..10].strip, line[11..20].strip, line[51..59].strip]
        if !are_numbers(numbers) || !right_string_len(strings, lengths)
          return false
        end
      end
    end
    return true
  end

  def right_string_len(strings, len)
    strings.each_with_index do |string, index|
      if string.length != len[index]
        return false
      end
    end
    return true
  end

  def are_numbers(numbers)
    numbers.each do |number|
      if !number.match(/^(\d)+$/)
        return false
      end
    end
    return true
  end

  def update_position(data)
    data.keys.each do |semester|
      semester = data[semester]
      session = Session.find_by(year: semester[:year], semester: semester[:semester])
      if session
        semester[:courses].keys.each do |course|
          update_position_helper(course, semester, session)
        end
      end
    end
  end

  def update_position_helper(course, semester, session)
    course_code = course[/[a-z0-9]{3}\d{3,4}/]
    course = semester[:courses][course]
    positions = Position.where(session_id: session[:id])
    positions.each do |position|
      if position[:position].downcase.include? course_code
        Rails.logger.debug "original #{JSON.pretty_generate(position.as_json)}\n\n"
        position.update_attributes!(course)
        Rails.logger.debug "updated #{JSON.pretty_generate(position.as_json)}\n\n"
      end
    end
  end

  def parse_lines(lines)
    data = {}
    lines.each do |line|
      term = line[0..5].strip
      if !data[term.to_sym]
        data[term.to_sym] = get_semester(term).merge({courses: {}})
      end
      course_code = line[11..20].strip.downcase.to_sym
      parsed = get_parsed(line)
      if parsed[:department]=="CSC" && parsed[:section][0..2]!='TUT'
        parse_courses(data, term.to_sym, course_code, parsed)
      end
    end
    update_position(data)
  end

  def parse_courses(data, term, course_code, parsed)
    if !course_exists(data, term, course_code)
      data[term][:courses][course_code] = {
        course_name: parsed[:course_name],
        cap_enrolment: parsed[:cap_enrolment],
        current_enrolment: parsed[:current_enrolment],
        num_waitlisted: parsed[:num_waitlisted],
      }
    else
      data[term][:courses][course_code][:current_enrolment]+=parsed[:current_enrolment]
      data[term][:courses][course_code][:cap_enrolment]+=parsed[:cap_enrolment]
      data[term][:courses][course_code][:num_waitlisted]+=parsed[:num_waitlisted]
    end
  end

  def get_parsed(line)
    {
      department: line[6..10].strip,
      course_name: line[21..50].strip,
      section: line[51..59].strip,
      type: line[60..63].strip,
      cap_enrolment: line[64..67].to_i,
      current_enrolment: line[68..71].to_i,
      num_waitlisted: line[74..line.length-1].to_i,
    }
  end

  def course_exists(data, term, course_code)
    if data[term][:courses][course_code]
      return true
    else
      return false
    end
  end

  def get_semester(term)
    year = term[0..3]
    month = term[4]
    semester = ""
    case month.to_i
    when 1
      semester = "Winter"
    when 5
      semester = "Summer"
    when 9
      semester = "Fall"
    end
    return {year: year, semester: semester}
  end
end
