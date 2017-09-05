class CreateAllocations < ActiveRecord::Migration[5.1]
  def change
    create_table :allocations do |t|
      t.integer :num_unit
      t.string :type
      t.integer :minutes
      t.references :duty, foreign_key: true

      t.timestamps
    end
  end
end
