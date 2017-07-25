class Contract < ApplicationRecord
  belongs_to :offer

  def get_deadline
    return self[:created_at] + (2*7*24*60*60)
  end
end
