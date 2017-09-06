class Template < ApplicationRecord
  belongs_to :position
  belongs_to :instructor
  has_many :categories
  has_many :allocations
  has_many :trainings
  validates :name, uniqueness: {scope: :instructor}
end
