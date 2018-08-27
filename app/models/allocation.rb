class Allocation < ApplicationRecord
  belongs_to :task, optional: true
  belongs_to :ddah, optional: true
  include Model
end
