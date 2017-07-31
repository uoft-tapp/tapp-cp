require 'net/http'
class Session < ActiveResource::Base
  self.site = "http://#{ENV['TAPP']}:3000/"
end
