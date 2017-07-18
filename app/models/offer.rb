class Offer < ApplicationRecord
  belongs_to :position
  belongs_to :instructor
  belongs_to :applicant
end
