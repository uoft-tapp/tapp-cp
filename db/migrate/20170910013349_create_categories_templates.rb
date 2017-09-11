class CreateCategoriesTemplates < ActiveRecord::Migration[5.1]
  def change
    create_join_table :templates, :categories do |t|
      t.index [:template_id, :category_id]
    end
  end
end
