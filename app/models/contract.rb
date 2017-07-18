class Contract < ApplicationRecord
  belongs_to :position_id
  belongs_to :applicant_id
end
