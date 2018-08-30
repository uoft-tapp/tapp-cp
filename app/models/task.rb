class Task < ApplicationRecord
  belongs_to :duty, optional: true
  has_and_belongs_to_many :templates
  include Model
end
