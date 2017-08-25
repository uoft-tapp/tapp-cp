class AddHoursToAssignments < ActiveRecord::Migration[5.1]
  def change
    add_column :assignments, :hours, :integer
  end
end
