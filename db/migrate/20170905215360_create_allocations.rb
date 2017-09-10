class CreateAllocations < ActiveRecord::Migration[5.1]
  def change
    create_table :allocations do |t|
      t.integer :num_unit
      t.string :unit_name
      t.integer :minutes
      t.references :duty, foreign_key: true
      t.references :ddah, foreign_key: true
      t.references :template, foreign_key: true

      t.timestamps
    end
  end
end
