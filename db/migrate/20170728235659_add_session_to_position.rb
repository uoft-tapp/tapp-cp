class AddSessionToPosition < ActiveRecord::Migration[5.1]
  def change
    add_reference :positions, :session, foreign_key: true
  end
end
