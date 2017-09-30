class DdahImporter
  include DdahUpdater
  require 'csv'

  def import_ddahs(data)
    exceptions = []
    data = parse_to_cell_json(data)
    if valid_ddah(data)
      instructor = Instructor.find_by(utorid: data[1][:B])
      if instructor
        position = Position.find_by(position: data[2][:B], round_id: data[3][:B])
        if position
          ddahs = get_all_ddahs(data, instructor, position, exceptions)
          ddahs.each do |data|
            ddah = Ddah.find_by(offer_id: data[:offer_id])
            offer = Offer.find(data[:offer_id])
            if ddah
              update_form(ddah, data)
              if offer[:ddah_status] =="None" || !offer[:ddah_status]
                offer.update_attributes!(ddah_status: "Created")
              end
            else
              ddah = Ddah.create!(
                offer_id: data[:offer_id],
                instructor_id: data[:instructor_id],
                optional: data[:optional],
              )
              update_form(ddah, data)
              offer.update_attributes!(ddah_status: "Created")
            end
          end
        else
          exceptions.push("Error: No such position. Operation Aborted.")
        end
      else
        exceptions.push("Error: No instructor specified. Operation Aborted.")
      end
    else
      exceptions.push("Error: Not a DDAH CSV. Operation Aborted.")
    end
    return get_status(exceptions, "DDAH")
  end

  def import_template(data)
    exceptions = []
    return get_status(exceptions, "DDAH Templates")
  end

  private
  def get_status(exceptions, type)
    if exceptions.length > 0
      return {imported: true, errors: true, message: exceptions}
    else
      return {imported: true, errors: false, message: ["#{type} import was successful."]}
    end
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

  def to_i(alpha)
    alpha26 = ("a".."z").to_a
    result = 0
    alpha = alpha.downcase
    (1..alpha.length).each do |i|
      char = alpha[-i]
      result += 26**(i-1) * (alpha26.index(char) + 1)
    end
    result
  end

  def parse_to_cell_json(data)
    csv = CSV.parse(data)
    cells = {num_line: csv.length}
    csv.each_with_index do |line, index|
      row = index+1
      cells[row] = {}
      line.each_with_index do |item, column|
        column = num_to_alpha(column+1).upcase.to_sym
        cells[row][column] = item
      end
    end
    return cells
  end

  def get_all_ddahs(data, instructor, position, exceptions)
    ddahs = []
    (13..data[:num_line]).step(6) do |line|
      data = get_ddah(data, line, position, exceptions)
      data[:instructor_id] = instructor[:id]
      ddahs.push(data)
    end
    return ddahs
  end

  def get_ddah(data, line, position, exceptions)
    applicant = Applicant.find_by(utorid: data[line+1][:B].strip)
    if applicant
      offer = Offer.find_by(applicant_id: applicant[:id], position_id: position[:id])
      if offer
        ddah = {
          offer_id: offer[:id],
          optional: true,
          trainings: get_data_attribute(data, line, :D, false, 1),
          categories: get_data_attribute(data, line, :D, false, 3),
          allocations: get_allocations(data, line),
        }
        ddah[:trainings] = get_array(ddah[:trainings])
        ddah[:categories] = get_array(ddah[:categories])
        return ddah
      else
        exceptions.push("Error: No offer of #{data[line+1][:A]} for #{position[:position]} exists in the system.")
        return nil
      end
    else
      exceptions.push("Error: No such applicant as #{data[line+1][:A]}")
      return nil
    end
  end

  def get_array(array)
    data = []
    if array
      array.split("").each do |item|
        data.push(to_i(item))
      end
    end
    return data
  end

  def get_allocations(data, line)
    allocations = []
    (1..24).step do |index|
      column = num_to_alpha(index + 6).upcase.to_sym
      next_column = num_to_alpha(index + 7).upcase.to_sym
      allocation = {
        id: get_data_attribute(data, line, column, true),
        num_unit: get_data_attribute(data, line, column, true, 1),
        unit_name: get_data_attribute(data, line, column,false, 2),
        duty_id: get_data_attribute(data, line, column, false, 3),
        minutes: get_data_attribute(data, line, column,true, 4),
      }
      if !empty_allocation(allocation)
        allocation[:duty_id] = to_i(allocation[:duty_id])
        allocations.push(allocation)
      end
    end
    return allocations
  end

  def get_data_attribute(data, line, column, integer, increment=0)
    if integer
      data[line+increment][column]? data[line+increment][column].strip.to_i : nil
    else
      data[line+increment][column]? data[line+increment][column].strip : nil
    end
  end

  def empty_allocation(allocation)
    checks = [:num_unit, :unit_name, :duty_id, :minutes]
    checks.each do |attr|
      if allocation[attr]
        return false
      end
    end
    return true
  end

  def valid_ddah(data)
    checks = [
      {
        row: 1,
        index: :A,
        content: "supervisor_utorid",
      },
      {
        row: 2,
        index: :A,
        content: "course_name",
      },
      {
        row: 3,
        index: :A,
        content: "round_id",
      },
      {
        row: 5,
        index: :A,
        content: "duties_list",
      },
      {
        row: 5,
        index: :D,
        content: "trainings_list",
      },
      {
        row: 5,
        index: :G,
        content: "categories_list",
      },
    ]
    valid = true
    checks.each do |check|
      if data[check[:row]][check[:index]] != check[:content]
        return false
      end
    end
    return data[:num_line]>=18
  end

end
