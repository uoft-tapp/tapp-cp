# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
offer = Offer.create!(
  position_id: 1,
  applicant_id: 1,
  hours: 60,
)
contract = offer.create_contract!(
  position_id: 1,
  applicant_id: 1,
  link: "my secret",
  deadline: Time.now + (2*7*24*60*60)
)
puts "db insert done"
