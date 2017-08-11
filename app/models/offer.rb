class Offer < ApplicationRecord
  include Model
  validates_uniqueness_of :position_id, scope: [:applicant_id]
  has_one :contract

  def get_deadline
    self.contract[:created_at] + (2*7*24*60*60)
  end

  def format
    offer = self.json
    position = (Position.find(self[:position_id])).json
    applicant = Applicant.find(self[:applicant_id]).json
    instructors = JSON.parse(position[:instructors].to_json, symbolize_names: true)
    session = Session.find(position[:session_id]).json
    data = {
      sent: self.contract.present?,
      position: position[:position],
      applicant: applicant,
      session: session,
      instructors: [],
    }
    if data[:sent]
      data[:deadline] = self.get_deadline
      data[:withdrawn] = Time.now > data[:deadline]
    end
    instructors.each do |instructor|
      data[:instructors].push(instructor)
    end
    return offer.merge(data)
  end
end
