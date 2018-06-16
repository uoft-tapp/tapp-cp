class Application < ApplicationRecord
  belongs_to :applicant
  has_many :preferences
end
