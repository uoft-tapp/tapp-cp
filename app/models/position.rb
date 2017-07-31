require 'net/http'
class Position < ActiveResource::Base
  self.site = "http://#{ENV['TAPP']}:3000/"

  def self.find_by_position(course_id, round_id)
    Position.all.as_json.find { |position| position["position"]==course_id && position["round_id"]==round_id }
  end

  def json
    JSON.parse(self.to_json, symbolize_names: true)
  end
end
