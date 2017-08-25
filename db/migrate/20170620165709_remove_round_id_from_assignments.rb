class RemoveRoundIdFromAssignments < ActiveRecord::Migration[5.1]
  def change
    remove_column :assignments, :round_id, :string
  end
end
