class Ddah < ApplicationRecord
  belongs_to :offer
  belongs_to :template, optional: true
  belongs_to :instructor
  belongs_to :department
  belongs_to :category
  has_many :allocations
  has_many :trainings
  validates :applicant, uniqueness: {scope: :position}
end
