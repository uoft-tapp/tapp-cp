class Template < ApplicationRecord
  belongs_to :position
  belongs_to :instructor
  has_many :categories
  has_many :allocations
  has_many :trainings
  validates :name, uniqueness: {scope: :instructor}
  include Model

  def format
    template = self.json
    position = Position.find(template[:position_id])
    data = {
      position: position.format,
    }
    return template.merge(data)
  end
end
