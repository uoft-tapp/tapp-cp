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
tasks = [
  {
    label: 'Marking/Grading',
    types: [
      'Assignment',
      'Test',
      'Final Exam',
      'Quiz',
      'Demo',
      'Book reviews',
      'Oral presentations',
      'Examinations',
      'Projects',
      'Midterms',
      'End-of-term tests',
      'Term Tests',
      'Laboratory reports',
      'Demonstrations',
      'Language tapes',
      'Data sheets',
      'Checking lab books',
      'Computer programs',
      'Quizzes',
      'Essays',
    ]
  },
  {
    label: 'Preparation',
    types: [
      'Prep Time for Tutorial',
      'Meeting with Supervisor',
      'Preparing course outline',
      'Preparing handouts',
      'Preparing bibliographies',
      'Preparing/setting up laboratory materials',
      'Preparing/setting up audiovisual materials',
      'Attending supervisor\'s lectures/seminars',
      'Reading texts/manuals/source materials',
      'Selecting relevant texts',
      'Preparing reading lists',
      'Preparing assignments/problem sets',
      'Attending supervisor\'s labs/tutorials',
      'Designing & preparing tests/examinations',
      'Announcing special seminars/workshops',
      'Developing/maintaining course web site',
      'Modeling effective review strategies',
    ]
  },
  {
    label: 'Contact Time',
    types: [
      'Office Hours',
      'Leading field trips',
      'Demonstrating problem solvung',
      'Demonstrating in language lab',
      'Demonstrating equipment outside of class',
      'Conducting tutorials/seminars/practicals',
      'Demonstrating in laboratory',
      'Consulting outside of office hours',
      'Conducting special seminars/workshops',
      'Consulting with students electronically',
      'Conducting lectures',
      'Tutoring individuals',
    ]
  },
  {
    label: 'Other Duties',
    types: [
      'Clerical',
      'Coordinating other TAs, Resources',
      'Technical Support',
      'Meetings with other TAs',
      'Exam/test invigilation',
    ]
  },
  {
    label: 'Training',
    types: [
      'Tutorial planning',
      'Providing effective feedback',
      'Classroom management',
      'Presentation skills',
      'Respond to students\' questions effectively',
      'Effective facilitation of group discussions',
      'Effective monitoring of students\' work',
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
def get_tasks_array(data)
  tasks = []
  data.each do |item|
    duty_id = Duty.find_by(name: item[:label])[:id]
    item[:types].each do |type|
      tasks.push({
        duty_id: duty_id,
        name: type,
      })
    end
  end
  return tasks
end
insert_seed_data(Instructor, [:utorid], [default_instructor], "Instructor")
insert_seed_data(Duty, [:name], map_key_to_array(:name, duty), "Duty")
insert_seed_data(Training, [:name], map_key_to_array(:name, training), "Training")
insert_seed_data(Category, [:name], map_key_to_array(:name, category), "Category")
puts Task.all
insert_seed_data(Task, [:name, :duty_id], get_tasks_array(tasks), "Task")
