class Position < ApplicationRecord
  has_many :assignments
  has_many :preferences
  has_and_belongs_to_many :instructors
  belongs_to :session
  validates_uniqueness_of :position, scope: :round_id
  include Model

  def format
    position = self.json
    data = { instructors: {} }
    self.instructors.each do |instructor|
      data[:instructors][instructor[:id]] = instructor[:name]
    end

    excludes = [
      :duties,
      :round_id,
      :qualifications,
      :estimated_count,
      :estimated_total_hours,
      :hours,
      :start_date,
      :end_date,
      :open,
    ]
    return position.except(*excludes).merge(data)
  end

end
