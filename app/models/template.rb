class Template < ApplicationRecord
  belongs_to :position
  belongs_to :instructor
  has_and_belongs_to_many :categories
  has_many :allocations
  has_and_belongs_to_many :trainings
  validates :name, uniqueness: {scope: :instructor}
  include Model

  def format
    template = self.json
    position = Position.find(template[:position_id])
    instructor = Instructor.find(template[:instructor_id])
    allocations = self.allocations.map do |allocation|
      allocation = allocation.json
      allocation.except(*[:template_id, :ddah_id])
    end
    data = {
      position: position.format,
      supervisor: instructor[:name],
      allocations: allocations,
      trainings: self.training_ids,
      categories: self.category_ids,
    }
    puts data
    return template.merge(data)
  end
end
