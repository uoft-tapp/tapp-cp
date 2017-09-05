class DdahsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access

  def index
    render json: Ddah.all.to_json
  end

  def show
    ddah = Ddah.find(params[:id])
    render json: ddah.to_json
  end

end
