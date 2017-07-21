require 'active_resource'
require 'net/http'
class Position < ActiveResource::Base
  self.site = "http://#{ENV['TAPP']}:3000/"

  def self.find_by(course_id, round_id)
    Position.all.as_json.each do |position|
      if position["position"]==course_id && position["round_id"]==round_id
        return position
      end
    end
    return nil
  end
end
