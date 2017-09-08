class CreateDdahs < ActiveRecord::Migration[5.1]
  def change
    create_table :ddahs do |t|
      t.boolean :optional, default: nil
      t.references :offer, foreign_key: true
      t.references :template, foreign_key: true
      t.references :instructor, foreign_key: true
      t.string :tutorial_category, default: "Classroom TA"
      t.string :department, default: "Computer Science"
      t.string :supervisor_signature
      t.string :ta_coord_signature
      t.string :student_signature

      t.timestamps
    end
    add_index(:ddahs, [:offer_id, :id], unique: true)
  end
end
