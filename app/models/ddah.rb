class Ddah < ApplicationRecord
  belongs_to :offer
  belongs_to :template, optional: true
  belongs_to :instructor
  has_many :categories
  has_many :allocations
  has_many :trainings
  validates :applicant, uniqueness: {scope: :position}
end
