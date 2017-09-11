class CreateDdahsCategories < ActiveRecord::Migration[5.1]
  def change
    create_join_table :ddahs, :categories do |t|
      t.index [:ddah_id, :category_id]
    end
  end
end
