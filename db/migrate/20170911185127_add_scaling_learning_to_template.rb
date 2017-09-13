class AddScalingLearningToTemplate < ActiveRecord::Migration[5.1]
  def change
    add_column :templates, :scaling_learning, :boolean, default: false
  end
end
