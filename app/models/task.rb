class Task < ApplicationRecord
  belongs_to :duty, optional: true
  include Model
end
