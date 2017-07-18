class Contract < ApplicationRecord
  belongs_to :position
  belongs_to :applicant
end
