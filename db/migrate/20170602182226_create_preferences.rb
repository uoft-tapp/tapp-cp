class CreatePreferences < ActiveRecord::Migration[5.1]
  def change
    create_table :preferences do |t|
      t.references :application, foreign_key: true
      t.references :position, foreign_key: true
      t.integer :rank

      t.timestamps
    end
  end
end
