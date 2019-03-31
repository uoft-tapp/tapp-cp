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
    # the Liquid templating engine assumes strings instead of symbols
    return applicant.except(*excludes).with_indifferent_access
  end
end
