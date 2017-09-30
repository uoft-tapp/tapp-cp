class DdahImporter
  include Importer
  include DdahUpdater

  def import_csv_ddahs(data)
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
            if ddah
              update_form(ddah, data)
            else
              ddah = Ddah.create!(
                offer_id: data[:offer_id],
                instructor_id: data[:instructor_id],
                optional: data[:optional],
              )
              update_form(ddah, data)
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

  def import_csv_template(data)
    exceptions = []
    return get_status(exceptions, "DDAH Templates")
  end

  def import_json_ddahs(data)
    exceptions = []
    data["ddahs"].each do |ddah|
      applicant = Applicant.find_by(utorid: ddah["utorid"])
      instructor = Instructor.find_by(utorid: ddah["supervisor"])
      position = Position.find_by(position: ddah["course_name"], round_id: ddah["round_id"])

      get_allocations_data(ddah["allocations"])
      trainings = get_trainings_categories(Training, ddah["trainings"], "Training")
      categories = get_trainings_categories(Category, ddah["categories"], "Categories")
    end
    return get_status(exceptions, "DDAH")
  end

  def import_json_templates(data)
    exceptions = []
    data["templates"].each do |template|
      instructor = Instructor.find_by(utorid: ddah["instructor"])

      get_allocations_data(ddah["allocations"])
      trainings = get_trainings_categories(Training, ddah["trainings"], "Training")
      categories = get_trainings_categories(Category, ddah["categories"], "Categories")
    end
    return get_status(exceptions, "DDAH Template")
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
    lines = data.split(/\n/)
    cells = {num_line: lines.length}
    lines.each_with_index do |line, index|
      row = index+1
      cells[row] = {}
      items = line.split(/,/)
      items.each_with_index do |item, column|
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
        data = {
          offer_id: offer[:id],
          trainings: data[line+1][:D].strip,
          categories: data[line+3][:E].strip,
          allocations: get_allocations(data, line),
        }
        data[:trainings] = get_array(data[:trainings])
        data[:categories] = get_array(data[:categories])
        return data
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
    if array.length>0
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
        id: get_allocation_attribute(data, line, column, true),
        num_units: get_allocation_attribute(data, line, column, true, 1),
        unit_name: get_allocation_attribute(data, line, column,false, 2),
        duty_id: get_allocation_attribute(data, line, next_column, false, 3),
        minutes: get_allocation_attribute(data, line, column,true, 4),
      }
      if !empty_allocation(allocation)
        allocation[:duty_id] = to_i(allocation[:duty_id])
        allocations.push(allocation)
      end
    end
    return allocations
  end

  def get_allocation_attribute(data, line, column, integer, increment=0)
    if integer
      data[line+increment][column]? data[line+increment][column].strip.to_i : nil
    else
      data[line+increment][column]? data[line+increment][column].strip : nil
    end
  end

  def empty_allocation(allocation)
    checks = [:num_units, :unit_name, :duty_id, :minutes]
    checks.each do |attr|
      if !allocation[attr]
        return true
      end
    end
    return false
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

  def get_allocations_data(allocations)
    data = []
    allocations.each_with_index do |allocation, index|
      duty = Duty.find_by(name: allocation["duty"])
      if duty
        data.push({
          num_units: allocation["num_units"],
          unit_name: allocation["unit_name"],
          minutes: allocation["minutes"],
          duty_id: duty[:id],
        })
      else
        exceptions.push("Allocation at index #{index} is a non-existent duty type. Check your spelling.")
      end
    end
    return data
  end

  def get_trainings_categories(model, items, type, exceptions)
    data = []
    items.each do |item|
      temp = model.find_by(name: item)
      if temp
        data.push(temp[:id])
      else
        exceptions.push("#{type} at index #{index} is a non-existent #{type.downcase}. Check your spelling.")
      end
    end
  end
end
