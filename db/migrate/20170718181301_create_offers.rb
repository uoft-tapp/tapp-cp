class CreateOffers < ActiveRecord::Migration[5.1]
  def change
    create_table :offers do |t|
      t.references :position, position: true, foreign_key: true
      t.references :instructor_id, instructor: true, foreign_key: true
      t.references :applicant_id, applicant: true, foreign_key: true
      t.boolean :objection
      t.boolean :sent
      t.boolean :accepted

      t.timestamps
    end
  end
end
