class RemovePositionIdFromTemplates < ActiveRecord::Migration[5.1]
  def change
    remove_reference :templates, :position, foreign_key: true
  end
end
