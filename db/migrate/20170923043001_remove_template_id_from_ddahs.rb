class RemoveTemplateIdFromDdahs < ActiveRecord::Migration[5.1]
  def change
    remove_reference :ddahs, :template, foreign_key: true
  end
end
