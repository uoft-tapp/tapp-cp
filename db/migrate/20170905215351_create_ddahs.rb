class CreateDdahs < ActiveRecord::Migration[5.1]
  def change
    create_table :ddahs do |t|
      t.boolean :optional
      t.references :offer, foreign_key: true
      t.references :template, foreign_key: true
      t.references :instructor, foreign_key: true
      t.references :category, foreign_key: true
      t.string :department, default: "Computer Science"

      t.timestamps
    end
    add_index(:ddahs, [:offer_id, :id], unique: true)
  end
end
