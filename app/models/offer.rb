class Offer < ApplicationRecord
  validates_uniqueness_of :position_id, :scope => [:applicant_id]
end
