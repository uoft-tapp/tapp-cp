class CreateTemplates < ActiveRecord::Migration[5.1]
  def change
    create_table :templates do |t|
      t.string :name, null: false
      t.boolean :optional
      t.references :position, foreign_key: true
      t.references :instructor, foreign_key: true
      t.string :tutorial_category, default: "Classroom TA"
      t.string :department, default: "Computer Science"

      t.timestamps
    end
    add_index(:templates, [:name, :instructor_id, :id], unique: true)
  end
end
