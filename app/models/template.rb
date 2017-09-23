class Template < ApplicationRecord
  belongs_to :instructor
  has_and_belongs_to_many :categories
  has_many :allocations
  has_and_belongs_to_many :trainings
  validates :name, uniqueness: {scope: :instructor}
  include Model

  def format
    template = self.json
    instructor = Instructor.find(template[:instructor_id])
    allocations = self.allocations.map do |allocation|
      allocation = allocation.json
      allocation.except(*[:template_id, :ddah_id])
    end
    data = {
      supervisor: instructor[:name],
      allocations: allocations,
      trainings: self.training_ids,
      categories: self.category_ids,
    }
    return template.merge(data)
  end
end
