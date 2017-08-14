class CreateOffers < ActiveRecord::Migration[5.1]
  def change
    create_table :offers do |t|
      t.references :position, index: true
      t.references :applicant, index: true
      t.integer :hours, null: false
      t.integer :year
      t.string :session
      t.string :status, default: "Unsent"
      t.string :hr_status, default: nil
      t.string :ddah_status, default: nil
      t.text :link
      t.datetime :print_time, null: true
      t.datetime :send_date, null: true
      t.integer :nag_count, default: 0

      t.timestamps
    end
  end
end
