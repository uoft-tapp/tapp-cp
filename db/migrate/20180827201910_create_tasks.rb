class CreateTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :tasks do |t|
      t.string :name
      t.boolean :legacy, default: false
      t.references :duty, foreign_key: true
    end
  end
end
