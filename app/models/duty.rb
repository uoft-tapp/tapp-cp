class Duty < ApplicationRecord
  has_many :allocations
  validates :name, uniqueness: true
end
