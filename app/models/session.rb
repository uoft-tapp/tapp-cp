require 'net/http'
class Session < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:#{ENV['TAPP_PORT']}/"
end
