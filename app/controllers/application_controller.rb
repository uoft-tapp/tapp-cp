class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  rescue_from (Errno::ECONNREFUSED) do |e|
    render status: :not_found, json: { status: 404 }
  end
end
