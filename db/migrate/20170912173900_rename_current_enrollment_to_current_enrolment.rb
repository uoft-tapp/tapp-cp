class RenameCurrentEnrollmentToCurrentEnrolment < ActiveRecord::Migration[5.1]
  def change
    rename_column :positions, :current_enrollment, :current_enrolment
  end
end
