module DdahUpdater
  def update_form(form, params)
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

  def update_allocations(form, allocations)
    delete_missing_allocations(form, allocations)
    allocations.each do |entry|
      if entry[:id]
        allocation = Allocation.find(entry[:id])
        allocation.update_attributes(
          num_unit: entry[:num_unit],
          type: entry[:type],
          minutes: entry[:minutes],
          duty_id: entry[:duty_id],
        )
      else
        form.allocations.create!(
          num_unit: entry[:num_unit],
          type: entry[:type],
          minutes: entry[:minutes],
          duty_id: entry[:duty_id],
        )
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
    allocations.map do |allocation|
      if allocation[:id]
        allocation[:id]
      end
    end
  end

  def get_deleted_allocations(form_ids, allocation_ids)
    form_ids.map do |id|
      if !(allocation_ids.include?id)
        id
      end
    end
  end

end
