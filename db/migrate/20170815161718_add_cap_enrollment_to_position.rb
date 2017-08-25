class AddCapEnrollmentToPosition < ActiveRecord::Migration[5.1]
  def change
    add_column :positions, :cap_enrollment, :integer
  end
end
