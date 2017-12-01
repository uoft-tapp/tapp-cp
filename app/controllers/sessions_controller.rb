class SessionsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access, except: [:update]
  before_action :cp_admin, only: [:update]

  def index
    render json: format_all_session
  end

  def show
    session = Session.find(params[:id])
    render json: session.format
  end

  def update
    session = Session.find(params[:id])
    session.update_attributes!(update_session)
  end

  private
  def update_session
    params.permit(:pay)
  end

  def format_all_session
    sessions = []
    Session.all.each do |session|
      sessions.push(session.format)
    end
    return sessions
  end
end
