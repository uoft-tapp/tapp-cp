require 'net/http'
class Position < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:3000/"

  def self.find_by_position(course_id, round_id)
    Position.all.each do |position|
      position = position.json
      if position[:position]==course_id && position[:round_id]==round_id
        return position
      end
    end
    return nil
  end
end
