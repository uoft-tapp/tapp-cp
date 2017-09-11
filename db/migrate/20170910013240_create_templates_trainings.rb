class CreateTemplatesTrainings < ActiveRecord::Migration[5.1]
  def change
    create_join_table :templates, :trainings do |t|
      t.index [:template_id, :training_id]
    end
  end
end
