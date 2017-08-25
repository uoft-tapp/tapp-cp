class CreateSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :sessions do |t|
      t.integer :year
      t.datetime :start_date
      t.datetime :end_date
      t.string :semester
      t.float :pay, default: 0.0

      t.timestamps
    end
  end
end
