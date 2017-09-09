class AddDdahNagCountToOffer < ActiveRecord::Migration[5.1]
  def change
    add_column :offers, :ddah_nag_count, :integer, default: 0
  end
end
