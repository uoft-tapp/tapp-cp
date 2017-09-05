class CreateTemplates < ActiveRecord::Migration[5.1]
  def change
    create_table :templates do |t|
      t.string :name
      t.boolean :optional
      t.references :position, foreign_key: true
      t.references :instructor, foreign_key: true
      t.references :department, foreign_key: true
      t.references :category, foreign_key: true

      t.timestamps
    end
  end
end
