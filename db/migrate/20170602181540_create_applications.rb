class CreateApplications < ActiveRecord::Migration[5.1]
  def change
    create_table :applications do |t|
      t.references :applicant, foreign_key: true
      t.text :ta_training
      t.string :access_acad_history
      t.string :dept
      t.string :program_id
      t.integer :yip
      t.text :ta_experience
      t.text :academic_qualifications
      t.text :technical_skills
      t.text :availability
      t.text :other_info
      t.text :special_needs
      t.text :raw_prefs

      t.timestamps
    end
  end
end
