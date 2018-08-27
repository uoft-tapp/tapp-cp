class RemoveTemplateIdFromAllocations < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:allocations, :templates)
      remove_foreign_key :allocations, :templates
    end
  end
end
