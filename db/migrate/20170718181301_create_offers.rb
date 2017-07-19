class CreateOffers < ActiveRecord::Migration[5.1]
  def change
    create_table :offers do |t|
      t.references :position, position: true, foreign_key: true, index: true
      t.references :instructor, instructor: true, foreign_key: true, index: true
      t.references :applicant, applicant: true, foreign_key: true, index: true
      t.boolean :objection, default: false
      t.boolean :sent, default: false
      t.boolean :accepted, default: false

      t.timestamps
    end
  end
end
