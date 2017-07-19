require 'active_resource'
require 'net/http'
class Position < ActiveResource::Base
  self.site = "http://#{ENV['tapp']}:3000/"
end
