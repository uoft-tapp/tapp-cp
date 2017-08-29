class DropCampus < ActiveRecord::Migration[5.1]
  def up
     drop_table :campus
  end
end
