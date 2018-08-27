class PopulateTasks < ActiveRecord::Migration[5.1]
  def change
    data = []
    Allocation.all.each do |allocation|
      data.push({
        id: allocation[:id],
        name: allocation[:unit_name],
        duty_id: allocation[:duty_id],
      })
    end
    data.each do |item|
      task = Task.create!(name: item[:name], duty_id: item[:duty_id], legacy: true)
      allocation = Allocation.find(item[:id])
      allocation.update_attributes(task_id: task[:id])
    end
  end
end
