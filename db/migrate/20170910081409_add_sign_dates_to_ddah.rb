class AddSignDatesToDdah < ActiveRecord::Migration[5.1]
  def change
    add_column :ddahs, :supervisor_sign_date, :date
    add_column :ddahs, :ta_coord_sign_date, :date
    add_column :ddahs, :student_sign_date, :date
  end
end
