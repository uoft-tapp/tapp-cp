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
      session_info: session.format,
      instructors: [],
      deadline: self.get_deadline,
    }
    if offer[:send_date]
      data[:deadline] = self.get_deadline
    end
    if ddah
      data[:ddah_applicant_nag_count] = ddah[:nag_count]
      data[:ddah_send_date] = ddah[:send_date]
    end
    instructors.each do |instructor|
      data[:instructors].push(instructor)
    end
    # the Liquid templating engine assumes strings instead of symbols
    return offer.merge(data).with_indifferent_access
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
    # the Liquid templating engine assumes strings instead of symbols
    return offer.merge(data).except(*excludes).with_indifferent_access
  end
end
