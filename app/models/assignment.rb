require 'net/http'
class Assignment < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:3000/"
end
