class Template < ApplicationRecord
  belongs_to :position
  has_and_belongs_to_many :tasks
  include Model

  def format
    template = self.json
    data = {
      tasks: self.task_ids,
    }
    return template.merge(data)
  end
end
