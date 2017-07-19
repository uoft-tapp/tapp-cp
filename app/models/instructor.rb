require 'active_resource'
require 'net/http'
class Instructor < ActiveResource::Base
  self.site = "http://#{ENV['tapp']}:3000/"
end
