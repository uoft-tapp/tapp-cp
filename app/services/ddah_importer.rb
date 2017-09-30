class DdahImporter
  include Importer
  def import_ddahs(data)
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

  def import_templates(data)
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
