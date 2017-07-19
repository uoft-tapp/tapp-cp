class CreateContracts < ActiveRecord::Migration[5.1]
  def change
    create_table :contracts do |t|
      t.references :position, position: true, foreign_key: true, index: true
      t.references :applicant, applicant: true, foreign_key: true, index: true
      t.text :hash, null: false
      t.boolean :accepted, default: false
      t.boolean :withdrawn, default: false
      t.boolean :printed, default: false
      t.integer :nag_count, default: 0
      t.datetime :deadline, null: false

      t.timestamps
    end
    add_index :contracts, :hash
  end
end
