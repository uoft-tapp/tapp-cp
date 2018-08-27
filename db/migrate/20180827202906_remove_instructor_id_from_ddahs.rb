class RemoveInstructorIdFromDdahs < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:ddahs, :instructors)
      remove_foreign_key :ddahs, :instructors
    end
  end
end
