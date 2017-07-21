class CreateOffers < ActiveRecord::Migration[5.1]
  def change
    create_table :offers do |t|
      t.references :position, index: true
      t.references :applicant, index: true
      t.boolean :objection, default: false
      t.boolean :sent, default: false
      t.boolean :accepted, default: false

      t.timestamps
    end
    validates_uniqueness_of :position, :scope => [:applicant]
  end
end
