class CreateAssignments < ActiveRecord::Migration[5.1]
  def change
    create_table :assignments do |t|
      t.references :applicant, foreign_key: true
      t.references :position, foreign_key: true
      t.string :round_id
      t.timestamp :export_date

      t.timestamps
    end
  end
end
