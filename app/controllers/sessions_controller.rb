class SessionsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: Session.all.to_json
  end

  def show
    session = Session.find(params[:id])
    render json: session.to_json
  end

  def update
    session = Session.find(params[:id])
    session.update_attributes(pay: params[:session][:pay])
  end

end
