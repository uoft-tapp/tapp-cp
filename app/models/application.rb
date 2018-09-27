class Application < ApplicationRecord
  belongs_to :applicant
  has_many :preferences
  accepts_nested_attributes_for :preferences
end
