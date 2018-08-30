class AddRevisedMinutesToAllocations < ActiveRecord::Migration[5.1]
  def change
    add_column :allocations, :revised_minutes, :integer
  end
end
