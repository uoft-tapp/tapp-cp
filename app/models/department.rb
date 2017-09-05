class Department < ApplicationRecord
  validates :name, uniqueness: true
end
