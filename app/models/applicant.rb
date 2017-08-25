class Applicant < ApplicationRecord
  has_many :applications
  has_many :assignments
end
