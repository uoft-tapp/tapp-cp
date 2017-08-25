class AddDeptToApplicants < ActiveRecord::Migration[5.1]
  def change
    add_column :applicants, :dept, :string

    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE applicants
          SET dept=applications.dept
          FROM applications
          WHERE applications.applicant_id=applicants.id;
        SQL
      end

      dir.down do
        execute <<-SQL
        UPDATE applications
        SET dept=applicants.dept
        FROM applicants
        WHERE applications.applicant_id=applicants.id;
        SQL
      end
    end

    remove_column :applications, :dept, :string
  end
end
