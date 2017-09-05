class CreateDdahs < ActiveRecord::Migration[5.1]
  def change
    create_table :ddahs do |t|
      t.boolean :optional
      t.references :applicant, foreign_key: true
      t.references :position, foreign_key: true
      t.references :template, foreign_key: true
      t.references :instructor, foreign_key: true
      t.references :department, foreign_key: true
      t.references :category, foreign_key: true

      t.timestamps
    end
    add_index(:ddahs, [:applicant, :position, :id], unique: true)
  end
end
