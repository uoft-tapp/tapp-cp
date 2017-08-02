require 'net/http'
class Instructor < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:3000/"
end
