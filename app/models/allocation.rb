class Allocation < ApplicationRecord
  belongs_to :duty
  belongs_to :template, optional: true
  belongs_to :ddah, optional: true
  include Model
end
