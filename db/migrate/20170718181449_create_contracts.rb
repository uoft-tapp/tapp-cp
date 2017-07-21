class CreateContracts < ActiveRecord::Migration[5.1]
  def change
    create_table :contracts do |t|
      t.references :position, index: true
      t.references :applicant, index: true
      t.text :link, null: false
      t.boolean :accepted, default: false
      t.boolean :withdrawn, default: false
      t.boolean :printed, default: false
      t.integer :nag_count, default: 0
      t.datetime :deadline, null: false

      t.timestamps
    end
    add_index :contracts, :link
    validates_uniqueness_of :position, :scope => [:applicant]  
  end
end
