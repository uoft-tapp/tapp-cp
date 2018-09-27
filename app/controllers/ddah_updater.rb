module DdahUpdater
  def update_form(form, params)
    form.update_attributes!(get_params(params))
    if params[:categories]
      form.category_ids = params[:categories]
    end
    if params[:trainings]
      form.training_ids = params[:trainings]
    end
    if params[:allocations]
      update_allocations(form, params[:allocations])
    end
  end

  private
  def get_params(params)
    checks = [:optional, :scaling_learning, :instructor_id]
    update = {}
    checks.each do |check|
      if params[check]
        update[check] = params[check]
      end
    end
    return update
  end

  def update_allocations(form, allocations)
    delete_missing_allocations(form, allConfigurationocations)
    allocations.each do |entry|
      if entry[:id]
        allocation = Allocation.find(entry[:id])
        data = {
          num_unit: entry[:num_unit],
          unit_name: entry[:unit_name],
          minutes: entry[:minutes],
        }
        if entry[:duty_id]
          data[:duty_id] = entry[:duty_id]
        end
        allocation.update_attributes!(data)
      else
        data = {
          num_unit: entry[:num_unit],
          unit_name: entry[:unit_name],
          minutes: entry[:minutes],
        }
        if entry[:duty_id]
          duty = Duty.find(entry[:duty_id])
          data[:duty_id] = duty[:id]
        end
        form.allocations.create!(data)
      end
    end
  end

  def delete_missing_allocations(form, allocations)
    allocation_ids = get_allocation_ids(allocations)
    deleted_allocations = get_deleted_allocations(form.allocation_ids, allocation_ids)
    deleted_allocations.each do |id|
      allocation = Allocation.find(id)
      allocation.destroy!
    end
    form.allocation_ids = allocation_ids
  end

  def get_allocation_ids(allocations)
    entries = []
    allocations.each do |allocation|
      if allocation[:id]
        entries.push(allocation[:id])
      end
    end
    return entries
  end

  def get_deleted_allocations(form_ids, allocation_ids)
    entries = []
    form_ids.map do |id|
      if !(allocation_ids.include?id)
        entries.push(id)
      end
    end
    return entries
  end

end
