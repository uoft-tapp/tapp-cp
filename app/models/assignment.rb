class Assignment < ApplicationRecord
  belongs_to :applicant
  belongs_to :position
  validates :hours, numericality: true 
end
