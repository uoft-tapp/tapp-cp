class CreateContracts < ActiveRecord::Migration[5.1]
  def change
    create_table :contracts do |t|
      t.references :offer, offer: true, index: true, foreign_key: true
      t.text :link, null: false
      t.boolean :printed, default: false
      t.integer :nag_count, default: 0

      t.timestamps
    end
    add_index :contracts, :link
  end
end
