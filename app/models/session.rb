require 'net/http'
class Session < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:3000/"
end
