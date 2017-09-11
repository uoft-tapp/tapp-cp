class DutiesController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access

  def index
    render json: Duty.all.to_json
  end

  def show
    duty = Duty.find(params[:id])
    render json: duty.to_json
  end

end
