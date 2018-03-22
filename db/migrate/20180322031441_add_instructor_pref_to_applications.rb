class AddInstructorPrefToApplications < ActiveRecord::Migration[5.1]
  def change
    add_column :applications, :instructor_pref, :integer
  end
end
