class InstructorsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :tapp_admin

  def index
    instructors = Instructor.all
    render json: instructors.to_json
  end

  def show
    instructor = Instructor.find(params[:id])
    render json: instructor.to_json
  end

  def show_by_utorid
    instructor = Instructor.find_by(utorid: params[:utorid])
    render json: instructor.to_json
  end

end
