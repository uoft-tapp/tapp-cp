class RemoveTemplateIdFromAllocations < ActiveRecord::Migration[5.1]
  def change
    remove_reference :allocations, :template, foreign_key: true
  end
end
