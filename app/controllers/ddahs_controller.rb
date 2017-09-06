class DdahsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access

  def index
    if params[:utorid]
      
    else
      render json: Ddah.all.to_json
    end
  end

  def show
    ddah = Ddah.find(params[:id])
    render json: ddah.to_json
  end

end
