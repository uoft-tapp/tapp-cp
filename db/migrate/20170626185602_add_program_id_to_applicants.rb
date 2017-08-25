class AddProgramIdToApplicants < ActiveRecord::Migration[5.1]
  def change
    add_column :applicants, :program_id, :string

    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE applicants
          SET program_id=applications.program_id
          FROM applications
          WHERE applications.applicant_id=applicants.id;
        SQL
      end
      dir.down do
        execute <<-SQL
        UPDATE applications
        SET program_id=applicants.program_id
        FROM applicants
        WHERE applications.applicant_id=applicants.id;
        SQL
      end
    end

    remove_column :applications, :program_id, :string
  end
end
