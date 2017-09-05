class Category < ApplicationRecord
  validates :name, uniqueness: true
end
