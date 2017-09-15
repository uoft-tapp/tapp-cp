class Ddah < ApplicationRecord
  belongs_to :offer
  belongs_to :template, optional: true
  belongs_to :instructor
  has_and_belongs_to_many :categories
  has_many :allocations
  has_and_belongs_to_many :trainings
  include Model

  def get_deadline
    ddah = self.json
    if ddah[:send_date]
      DateTime.parse(offer[:send_date]).days_ago(-21)
    end
  end

  def format
    ddah = self.json
    offer = Offer.find(ddah[:offer_id])
    applicant = Applicant.find(offer[:applicant_id])
    position = Position.find(offer[:position_id])
    if !ddah[:template_id]
      allocations = self.allocations.map do |allocation|
        allocation = allocation.json
        allocation.except(*[:template_id, :ddah_id])
      end
      instructor = Instructor.find(ddah[:instructor_id])
      data = {
        applicant: applicant.format,
        supervisor: instructor[:name],
        position: position.format,
        allocations: allocations,
        trainings: self.training_ids,
        categories: self.category_ids,
      }
      if ddah[:send_date]
        data[:link] = offer[:link].sub!("pb", "pb/ddah")
        data[:deadline] = self.get_deadline
      end
      return ddah.merge(data)
    else
      template = Template.find(ddah[:template_id])
      instructor = Instructor.find(template[:instructor_id])
      allocations = template.allocations.map do |allocation|
        allocation = allocation.json
        allocation.except(*[:template_id, :ddah_id])
      end
      data = {
        applicant: applicant.format,
        supervisor: instructor[:name],
        position: position.format,
        allocations: allocations,
        trainings: template.training_ids,
        categories: template.category_ids,
      }
      attributes = [
        :optional,
        :department,
        :instructor_id,
        :tutorial_category,
      ]
      if ddah[:send_date]
        data[:link] = offer[:link].sub!("pb", "pb/ddah")
        data[:deadline] = self.get_deadline
      end
      overwrite(ddah, template, attributes)
      return ddah.merge(data)
    end
  end

  private
  def overwrite(ddah, template, attributes)
    attributes.each do |attr|
      ddah[attr] = template[attr]
    end
  end
end
