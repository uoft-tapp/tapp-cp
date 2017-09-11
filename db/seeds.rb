# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or create!d alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create!([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create!(name: 'Luke', movie: movies.first)
Duty.create!(name: "Training")
Duty.create!(name: "Additional Training (if required)")
Duty.create!(name: "Preparation")
Duty.create!(name: "Contact Time")
Duty.create!(name: "Marking/Grading")
Duty.create!(name: "Other Duties")

Training.create!(name: "Attending Health and Safety training session")
Training.create!(name: "Meeting with supervisor")
Training.create!(name: "Adapting Teaching Techniques (ATT) (scaling learning activities)")

Category.create!(name: "Discussion-based Tutorial")
Category.create!(name: "Skill Development Tutorial")
Category.create!(name: "Review and Q&A Session")
Category.create!(name: "Laboratory/Practical")
