class CreateTasksTemplates < ActiveRecord::Migration[5.1]
  def change
    create_join_table :tasks, :templates do |t|
      t.index [:task_id, :template_id]
    end
  end
end
