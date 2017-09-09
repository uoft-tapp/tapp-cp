class AddSendDateToDdah < ActiveRecord::Migration[5.1]
  def change
    add_column :ddahs, :send_date, :datetime
  end
end
