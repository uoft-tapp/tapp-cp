class Duty < ApplicationRecord
  validates :name, uniqueness: true
end
