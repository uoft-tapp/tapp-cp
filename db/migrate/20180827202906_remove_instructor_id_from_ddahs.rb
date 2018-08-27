class RemoveInstructorIdFromDdahs < ActiveRecord::Migration[5.1]
  def change
    remove_reference :ddahs, :instructor, foreign_key: true
  end
end
