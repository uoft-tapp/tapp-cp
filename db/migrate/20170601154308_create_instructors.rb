class CreateInstructors < ActiveRecord::Migration[5.1]
  def change
    create_table :instructors do |t|
      t.string :name
      t.string :email
      t.string :utorid

      t.timestamps
    end
    add_index :instructors, :email, unique: true
  end
end
