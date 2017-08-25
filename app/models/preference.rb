class Preference < ApplicationRecord
  belongs_to :application
  belongs_to :position
end
