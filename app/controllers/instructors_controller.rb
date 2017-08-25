class InstructorsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    instructors = Instructor.all
    render json: instructors.to_json
  end

  def show
    instructor = Instructor.find(params[:id])
    render json: instructor.to_json
  end

end
