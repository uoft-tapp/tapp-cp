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
    data = {

    }
    return template.merge(data)
  end
end
