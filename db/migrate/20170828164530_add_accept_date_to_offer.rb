class AddAcceptDateToOffer < ActiveRecord::Migration[5.1]
  def change
    add_column :offers, :accept_date, :datetime, default: nil
  end
end
