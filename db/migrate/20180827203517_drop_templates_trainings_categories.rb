class DropTemplatesTrainingsCategories < ActiveRecord::Migration[5.1]
  def change
    drop_table :templates_trainings
    drop_table :categories_templates
  end
end
