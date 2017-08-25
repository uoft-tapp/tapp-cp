class CreateCampus < ActiveRecord::Migration[5.1]
  def change
    create_table :campus, id: :integer, primary_key: :code do |t|
      t.string :name, null: false
    end
  end
end
