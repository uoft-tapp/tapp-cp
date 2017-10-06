# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or create!d alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create!([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create!(name: 'Luke', movie: movies.first)
duty = [
  "Training",
  "Additional Training (if required)",
  "Preparation",
  "Contact Time",
  "Marking/Grading",
  "Other Duties",
]
training = [
  "Attending Health and Safety training session",
  "Meeting with supervisor",
  "Adapting Teaching Techniques (ATT) (scaling learning activities)",
]
category = [
  "Discussion-based Tutorial",
  "Skill Development Tutorial",
  "Review and Q&A Session",
  "Laboratory/Practical",
]
def insert_seed_data(model, items, type)
  items.each do |item|
    data = model.find_by(name: item)
    if !data
      model.create!(name: item)
      puts "#{type} with name '#{item}' inserted."
    else
      puts "#{type} with name '#{item}' already exists."
    end
  end
end
insert_seed_data(Duty, duty, "Duty")
insert_seed_data(Training, training, "Training")
insert_seed_data(Category, category, "Category")
