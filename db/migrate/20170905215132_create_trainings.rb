class CreateTrainings < ActiveRecord::Migration[5.1]
  def change
    create_table :trainings do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index(:trainings, [:name, :id], unique: true)
  end
end
