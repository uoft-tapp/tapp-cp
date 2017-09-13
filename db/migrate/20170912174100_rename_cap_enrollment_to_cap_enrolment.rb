class RenameCapEnrollmentToCapEnrolment < ActiveRecord::Migration[5.1]
  def change
    rename_column :positions, :cap_enrollment, :cap_enrolment
  end
end
