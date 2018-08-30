class CreateTaskIdInAllocations < ActiveRecord::Migration[5.1]
  def change
    create_table :task_id_in_allocations do |t|
      t.references :task, foreign_key: true
    end
  end
end
