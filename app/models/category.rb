class Category < ApplicationRecord
  validates :name, uniqueness: true
  has_and_belongs_to_many :templates
  has_and_belongs_to_many :ddahs
end
