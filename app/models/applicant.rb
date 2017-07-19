require 'active_resource'
require 'net/http'
class Applicant < ActiveResource::Base
  self.site = "http://#{ENV['TAPP']}:3000/"
end
