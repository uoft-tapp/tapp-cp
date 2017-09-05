class Allocation < ApplicationRecord
  belongs_to :duty
  belongs_to :template
  belongs_to :ddah
end
