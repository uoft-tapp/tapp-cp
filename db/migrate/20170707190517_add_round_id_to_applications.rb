class AddRoundIdToApplications < ActiveRecord::Migration[5.1]
  def change
    add_column :applications, :round_id, :string
  end
end
