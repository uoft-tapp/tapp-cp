class AddYipToApplicants < ActiveRecord::Migration[5.1]
  def change
    add_column :applicants, :yip, :integer

    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE applicants
          SET yip=applications.yip
          FROM applications
          WHERE applications.applicant_id=applicants.id;
        SQL
      end
      dir.down do
        execute <<-SQL
        UPDATE applications
        SET yip=applicants.yip
        FROM applicants
        WHERE applications.applicant_id=applicants.id;
        SQL
      end
    end

    remove_column :applications, :yip, :integer
  end
end
