class Template < ApplicationRecord
  belongs_to :position
  belongs_to :instructor
  belongs_to :department
  belongs_to :category
  has_many :allocations
  has_many :trainings
end
