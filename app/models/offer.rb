class Offer < ApplicationRecord
  validates_uniqueness_of :position_id, scope: [:applicant_id]
  has_one :contract

  def get_deadline
    self.contract[:created_at] + (2*7*24*60*60)
  end

  def format
    offer = self.as_json
    position = Position.find(offer["position_id"]).as_json
    applicant = Applicant.find(offer["applicant_id"]).as_json
    instructors = position["instructors"].as_json
    data = {
      sent: self.contract.present?,
      position: position["position"],
      applicant: applicant,
      instructors: [],
    }
    if data[:sent]
      data[:deadline] = self.get_deadline
      data[:accepted] = self.contract[:accepted]
      data[:withdrawn] = Time.now > data[:deadline]
    end
    instructors.each do |instructor|
      data[:instructors].push(instructor)
    end
    return offer.merge(data)
  end

end
