class SessionsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :app_access, except: [:update]
  before_action :cp_admin, only: [:update]

  def index
    render json: Session.all.to_json
  end

  def show
    session = Session.find(params[:id])
    render json: session.to_json
  end

  def update
    session = Session.find(params[:id])
    session.update_attributes!(update_session)
  end

  private
  def update_session
    params.permit(:pay)
  end
end
