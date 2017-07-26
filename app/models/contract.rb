class Contract < ApplicationRecord
  belongs_to :offer

  def get_deadline
    self[:created_at] + (2*7*24*60*60)
  end

  def format
    offer = self.offer
    deadline = self.get_deadline
    contract = self.as_json
    position = Position.find(offer[:position_id]).as_json
    applicant = Applicant.find(offer[:applicant_id]).as_json
    return contract.merge({
      position: position["position"],
      applicant: applicant,
      deadline: deadline,
      contract: Time.now > deadline,
    })
  end
end
