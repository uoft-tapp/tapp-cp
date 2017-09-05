class Training < ApplicationRecord
  validates :name, uniqueness: true
end
