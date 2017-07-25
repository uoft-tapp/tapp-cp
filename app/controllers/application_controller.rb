class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  private
  def record_not_found
    render status: :not_found, json: { status: 404 }

  def main
    render :main, layout: false
  end
end
