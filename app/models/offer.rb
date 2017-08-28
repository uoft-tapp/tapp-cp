class Offer < ApplicationRecord
  include Model
  validates_uniqueness_of :position_id, scope: [:applicant_id]
  has_one :contract

  def get_deadline
    offer = self.json
    if offer[:send_date]
      DateTime.parse(offer[:send_date]).days_ago(-21)
    end
  end

  def format
    offer = self.json
    position = Position.find(self[:position_id])
    applicant = Applicant.find(self[:applicant_id])
    instructors = position.instructors
    session = Session.find(position[:session_id])
    offer[:link]= "/pb/#{offer[:link]}"
    data = {
      position: position[:position],
      applicant: applicant,
      session: session,
      instructors: [],
      deadline: self.get_deadline,
    }
    if offer[:send_date]
      data[:deadline] = self.get_deadline
    end
    instructors.each do |instructor|
      data[:instructors].push(instructor)
    end
    return offer.merge(data)
  end
end
