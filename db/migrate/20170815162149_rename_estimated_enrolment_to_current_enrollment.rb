class RenameEstimatedEnrolmentToCurrentEnrollment < ActiveRecord::Migration[5.1]
  def change
    rename_column :positions, :estimated_enrolment, :current_enrollment
  end
end
