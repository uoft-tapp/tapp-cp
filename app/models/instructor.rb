require 'net/http'
class Instructor < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:#{ENV['TAPP_PORT']}/"
end
