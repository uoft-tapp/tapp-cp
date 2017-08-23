require 'net/http'
class Assignment < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:#{ENV['TAPP_PORT']}/"
end
