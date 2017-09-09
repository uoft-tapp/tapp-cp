class Applicant < ApplicationRecord
  has_many :applications
  has_many :assignments
  include Model

  def format
    applicant = self.json
    excludes = [
      :address,
      :app_id,
      :commentary,
      :dept,
      :full_time,
      :yip,
    ]
    return applicant.except(*excludes)
  end
end
