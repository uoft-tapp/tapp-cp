class Offer < ApplicationRecord
  validates_uniqueness_of :position_id, scope: [:applicant_id]
  has_one :contract

  def get_deadline
    return self.contract[:created_at] + (2*7*24*60*60)
  end
end
