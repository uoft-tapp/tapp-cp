class AddScalingLearningToDdah < ActiveRecord::Migration[5.1]
  def change
    add_column :ddahs, :scaling_learning, :boolean, default: false
  end
end
