class CreateDdahsTrainings < ActiveRecord::Migration[5.1]
  def change
    create_join_table :ddahs, :trainings do |t|
      t.index [:ddah_id, :training_id]
    end
  end
end
