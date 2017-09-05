class CreateCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index(:categories, [:name, :id], unique: true)
  end
end
