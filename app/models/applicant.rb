require 'net/http'
class Applicant < ActiveResource::Base
  self.site = "http://#{ENV['TAPP']}:3000/"

  def self.find_by_utorid(utorid)
    Applicant.all.as_json.find { |applicant| applicant["utorid"]==utorid }
  end
  
  def json
    JSON.parse(self.to_json, symbolize_names: true)
  end
end
