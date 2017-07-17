require 'active_resource'
require 'net/http'
class Applicant < ActiveResource::Base
  self.site = "http://localhost:3000"
end
