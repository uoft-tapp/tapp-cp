# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or create!d alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create!([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create!(name: 'Luke', movie: movies.first)
default_instructor = {
  utorid: 'reidkare',
  name: 'Karen Reid',
  email: 'reid@cs.toronto.edu',
}
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
allocations = [
  {
    label: 'Marking/Grading',
    types: [
      'Assignment Grading',
      'Test Grading',
      'Final Exam Grading',
      'Quiz Marking',
      'Demo Grading',
    ]
  },
  {
    label: 'Preparation',
    types: [
      'Prep Time for Tutorial',
      'Meeting with Supervisor',
    ]
  },
  {
    label: 'Contact Time',
    types: [
      'Office Hours',
      'OH1',
      'OH2',
      'OH3',
    ]
  },
  {
    label: 'Other Duties',
    types: [
      'Other1',
      'Other2',
      'Other3',
      'Other4',
      'Other5',
    ]
  }
]
def insert_seed_data(model, keys, items, type)
  items.each do |item|
    uniq_key = get_uniq_key(keys, item)
    data = model.find_by(uniq_key)
    if !data
      model.create!(item)
      puts "#{type} with #{item} inserted."
    else
      puts "#{type} with #{uniq_key} already exists."
    end
  end
end
def get_uniq_key(keys, data)
  uniq_keys = {}
  keys.each do |key|
    uniq_keys[key] = data[key]
  end
  return uniq_keys
end
def map_key_to_array(key, data)
  map = []
  data.each do |item|
    entry = {}
    entry[key] = item
    map.push(entry)
  end
  return map
end
def get_allocation_array(data, template)
  allocations = []
  template_id = Template.find_by(template)[:id]
  data.each do |item|
    duty_id = Duty.find_by(name: item[:label])[:id]
    item[:types].each do |type|
      allocations.push({
        template_id: template_id,
        duty_id: duty_id,
        unit_name: type,
      })
    end
  end
  return allocations
end
insert_seed_data(Instructor, [:utorid], [default_instructor], "Instructor")
insert_seed_data(Duty, [:name], map_key_to_array(:name, duty), "Duty")
insert_seed_data(Training, [:name], map_key_to_array(:name, training), "Training")
insert_seed_data(Category, [:name], map_key_to_array(:name, category), "Category")

default_template = {
  name: 'Default Template',
  instructor_id: Instructor.find_by(utorid: 'reidkare')[:id],
}
insert_seed_data(Template, [:name, :instructor_id], [default_template], "Template")
insert_seed_data(Allocation, [:unit_name, :duty_id, :template_id],
  get_allocation_array(allocations, default_template), "Allocation")
