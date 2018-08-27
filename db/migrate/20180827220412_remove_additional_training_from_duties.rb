class RemoveAdditionalTrainingFromDuties < ActiveRecord::Migration[5.1]
  def change
    training = Duty.find_by(name: "Training")
    add_training = Duty.find_by(name: "Additional Training (if required)")
    if training && add_training
      Task.all.each do |task|
        if task[:duty_id] == add_training[:id]
          task.update_attributes(duty_id: training[:id])
        end
      end
      add_training.destroy!
    end
  end
end
