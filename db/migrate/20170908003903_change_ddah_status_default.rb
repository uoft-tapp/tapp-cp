class ChangeDdahStatusDefault < ActiveRecord::Migration[5.1]
  def up
    change_column_default :offers, :ddah_status, "None"
  end

  def down
    change_column_default :offers, :ddah_status, nil
  end
end
