class InstructorsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :admin_or_instructor

  def index
    instructors = Instructor.all
    render json: instructors.to_json
  end

  def show
    instructor = Instructor.find(params[:id])
    render json: instructor.to_json
  end

  def create
    if params[:utorid]
      if params[:name] && params[:email]
        instructor = Instructor.find_by(utorid: params[:utorid])
        if !instructor
          Instructor.create(
            utorid: params[:utorid],
            name: params[:name],
            email: params[:email],
          )
          render status: 200, json: {message: "Instructor #{params[:name]} has been created.'"}
        else
          render status: 404, json: {message: "This instructor already exists."}
        end
      else
        render status: 404, json: {message: "Missing either name or email."}
      end
    else
      render status: 404, json: {message: "No utorid given."}
    end
  end

  def update
    instructor = Instructor.find_by(id: params[:id])
    if instructor
      if params[:name] && params[:email]
        instructor.update_attributes!(
          name: params[:name],
          email: params[:email],
        )
        render status: 200, json: {message: "Instructor #{params[:name]}'s data has been updated.'"}
      else
        render status: 404, json: {message: "Missing either name or email."}
      end
    else
      render status: 404, json: {message: "No instructor with id #{params[:id]} exists in the system."}
    end
  end

  def destroy
    instructor = Instructor.find_by(id: params[:id])
    if instructor
      instructor.destroy!
      render status: 200, json: {message: "Instructor #{params[:id]} has been deleted."}
    else
      render status: 404, json: {message: "No instructor with id #{params[:id]} exists in the system."}
    end
  end

  def show_by_utorid
    instructor = Instructor.find_by(utorid: params[:utorid])
    render json: instructor.to_json
  end

end
