class CreateDepartments < ActiveRecord::Migration[5.1]
  def change
    create_table :departments do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index(:departments, [:name, :id], unique: true)
  end
end
