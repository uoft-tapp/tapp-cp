class Offer < ApplicationRecord
  validates_uniqueness_of :position_id, scope: [:applicant_id]
  belongs_to :applicant
  belongs_to :position
  include Model

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
    ddah = Ddah.find_by(offer_id: offer[:id])
    if offer[:link]
      offer[:link]= "#{ENV["domain"]}#{offer[:link]}"
    end
    data = {
      position: position[:position],
      start_date: position[:start_date],
      end_date: position[:end_date],
      applicant: applicant.format,
      session: session,
      instructors: [],
      deadline: self.get_deadline,
    }
    if offer[:send_date]
      data[:deadline] = self.get_deadline
    end
    if ddah
      data[:ddah_applicant_nag_count] = ddah[:nag_count]
    end
    instructors.each do |instructor|
      data[:instructors].push(instructor)
    end
    return offer.merge(data)
  end

  def instructor_format
    offer = self.json
    position = Position.find(self[:position_id])
    applicant = Applicant.find(self[:applicant_id])
    data = {
      position: position[:position],
      applicant: applicant.format,
    }
    excludes = [
      :accept_date,
      :commentary,
      :hr_status,
      :link,
      :nag_count,
      :print_time,
      :send_date,
      :signature,
      :year,
      :session,
    ]
    return offer.merge(data).except(*excludes)
  end
end
