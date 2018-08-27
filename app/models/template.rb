class Template < ApplicationRecord
  belongs_to :position
  has_and_belongs_to_many :tasks
  include Model
end
