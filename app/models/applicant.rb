require 'active_resource'
require 'net/http'
class Applicant < ActiveResource::Base
  self.site = "http://#{ENV['TAPP']}:3000/"

  def self.find_by(utorid)
    Applicant.all.as_json.each do |applicant|
      if applicant["utorid"]==utorid
        return applicant
      end
    end
    return nil
  end
end
