class Contract < ApplicationRecord
  validates_uniqueness_of :position_id, :scope => [:applicant_id]
  belongs_to :offer
end
