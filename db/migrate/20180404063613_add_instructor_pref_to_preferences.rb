class AddInstructorPrefToPreferences < ActiveRecord::Migration[5.1]
  def change
    add_column :preferences, :instructor_pref, :integer
  end
end
