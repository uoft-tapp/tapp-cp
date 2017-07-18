class CreateContracts < ActiveRecord::Migration[5.1]
  def change
    create_table :contracts do |t|
      t.references :position, position: true, foreign_key: true
      t.references :applicant, applicant: true, foreign_key: true
      t.text :hash
      t.boolean :accepted
      t.boolean :withdrawn
      t.boolean :printed
      t.integer :nag_count
      t.datetime :email_date
      t.datetime :deadline

      t.timestamps
    end
    add_index :contracts, :hash
  end
end
