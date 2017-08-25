class Instructor < ApplicationRecord
  has_many :courses
  validates :email, uniqueness: {allow_nil: true}
  has_and_belongs_to_many :positions

end
