class AddNumWaitlistedToPosition < ActiveRecord::Migration[5.1]
  def change
    add_column :positions, :num_waitlisted, :integer
  end
end
