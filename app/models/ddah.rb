class Ddah < ApplicationRecord
  belongs_to :offer
  belongs_to :template, optional: true
  belongs_to :instructor
  has_many :categories
  has_many :allocations
  has_many :trainings
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
      instructor = Instructor.find(ddah[:instructor_id])
      data = {
        applicant: applicant.format,
        supervisor: instructor[:name],
        position: position.format,
        allocations: self.allocations,
        trainings: self.trainings,
        categories: self.categories,
      }
      if ddah[:send_date]
        data[:deadline] = self.get_deadline
      end
      return ddah.merge(data)
    else
      template = Template.find(ddah[:template_id])
      instructor = Instructor.find(template[:instructor_id])
      data = {
        applicant: applicant.format,
        supervisor: instructor[:name],
        position: position.format,
        allocations: template.allocations,
        trainings: template.training_ids,
        categories: template.category_ids,
      }
      attributes = [
        :optional,
        :department,
        :instructor_id,
        :tutorial_category,
      ]
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
