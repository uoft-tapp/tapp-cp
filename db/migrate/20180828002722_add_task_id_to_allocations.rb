class AddTaskIdToAllocations < ActiveRecord::Migration[5.1]
  def change
    add_reference :allocations, :task, foreign_key: true
  end
end
