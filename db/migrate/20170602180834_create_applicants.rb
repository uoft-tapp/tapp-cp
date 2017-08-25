class CreateApplicants < ActiveRecord::Migration[5.1]
  def change
    create_table :applicants do |t|
      t.string :utorid, null: false
      t.string :app_id, null: false
      t.string :student_number
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone
      t.text :address
      t.text :commentary

      t.timestamps
    end
    add_index :applicants, :utorid, unique: true
  end
end
