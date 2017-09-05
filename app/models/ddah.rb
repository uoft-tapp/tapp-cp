class Ddah < ApplicationRecord
  belongs_to :applicant
  belongs_to :position
  belongs_to :template, optional: true
  belongs_to :instructor
  belongs_to :department
  belongs_to :category
  has_many :allocations
  has_many :trainings
end
