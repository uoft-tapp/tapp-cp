class RemoveDutyIdFromAllocations < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:allocations, :duties)
      remove_foreign_key :allocations, :duties
    end
  end
end
