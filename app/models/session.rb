class Session < ApplicationRecord
  has_many :positions

  def format
    self.as_json
  end
end
