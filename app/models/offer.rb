class Offer < ApplicationRecord
  belongs_to :position
  belongs_to :instructor_id
  belongs_to :applicant_id
end
