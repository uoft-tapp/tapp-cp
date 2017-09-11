class AddNagCountToDdah < ActiveRecord::Migration[5.1]
  def change
    add_column :ddahs, :nag_count, :integer, default: 0
  end
end
