require 'net/http'
class Instructor < ActiveResource::Base
  self.site = "http://#{ENV['TAPP']}:3000/"
end
