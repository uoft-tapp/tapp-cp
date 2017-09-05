class CreateDuties < ActiveRecord::Migration[5.1]
  def change
    create_table :duties do |t|
      t.string :name

      t.timestamps
    end
  end
end
