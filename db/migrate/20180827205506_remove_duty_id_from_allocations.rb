class RemoveDutyIdFromAllocations < ActiveRecord::Migration[5.1]
  def change
    remove_reference :allocations, :duty, foreign_key: true
  end
end
