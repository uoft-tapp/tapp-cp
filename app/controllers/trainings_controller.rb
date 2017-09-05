class TrainingsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access

  def index
    render json: Training.all.to_json
  end

  def show
    training = Training.find(params[:id])
    render json: training.to_json
  end

end
