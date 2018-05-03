class AssignmentsController < ApplicationController
  # protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  include Authorizer
  before_action :set_domain
  before_action :admin_or_instructor

 '''
    index #GET
      /assignments - returns a list of applicant including their assignment data
      /assignments?position_id - returns a list of applicants for a specific position
      /applicants/:applicant_id/assignments - returns an assignments given an applicant ID
 '''
  def index
      @assignments = if params[:applicant_id].present?
        Applicant.find(params[:applicant_id]).assignments
      elsif params[:position_id].present?
        Position.find(params[:position_id]).assignments
      elsif params[:session_id].present?
        assignments_from_session(params[:session_id], params[:utorid])
      else
        Assignment.all
      end

    render json: @assignments.to_json
  end

  '''
    show #GET
      /assignments/:id - returns an assignment given an assignment ID
  '''
  def show
    # Get all the assignments based off applicant_id and/or ID, include applicants
    @assignments = Assignment.find(params[:id])

    render json: @assignments.to_json
  end

  '''
    create #POST
        /applicants/:applicant_id/assignments
      hours, position_id

      creates an assignment between an applicant and a position.
      returns status 409 if tries to create a duplicate
  '''
  def create
    has_no_assignment = Assignment.where({applicant_id: params[:applicant_id], position_id: params[:position_id]}).exists?

    unless has_no_assignment
      @applicant = Applicant.find(params[:applicant_id])
      assignment = @applicant.assignments.build(assignment_params)

      # error checking save
      if assignment.save
        render json: assignment.to_json
      else
        render json: assignment.errors.to_hash(true), status: :unprocessable_entity
      end
    else
      # throw conflict if user tries to create duplicate assignments
      head :conflict
    end
  end

  '''
    update #PATCH
    /applicants/:applicant_id/assignments/:id
    hours

    updates the hours column for an applicant given assignment ID and applicant ID
  '''
  def update
    @applicant = Applicant.find(params[:applicant_id])
    assignment = @applicant.assignments.find(params[:id])

    if assignment.update_attributes(updateable_attributes)
      render json: assignment.to_json
    else
      render json: assignment.errors.to_hash(true), status: :unprocessable_entity
    end
  end


  '''
    destroy #DELETE
    /applicants/:applicant_id/assignments/:id

    removes (unassigns) an assignment record give an applicant ID and assignment ID
  '''
 # Unassign an assignee using applicant_id and assignment ID
  def destroy
    @applicant = Applicant.find(params[:applicant_id])
    @assignment = @applicant.assignments.find(params[:id])

    @assignment.destroy!
  end

  def email_assignments
    position = Position.find_by(position: params[:position], round_id: params[:round_id])
    if position
      applicants = get_position_applicants(position)
      if applicants.length != 0
        instructors = position.instructors
        if instructors.size > 0
          begin
            position.instructors.each do |instructor|
                TappMailer.assignment_email(position, instructor, applicants).deliver_now
            end
            render status: 200, json: {message: "Assignment Email Sent."}
          rescue Errno::ECONNREFUSED
            render status: 404, json: {message: "Connection Refused."}
          end
        else
          render status: 404, json: {message: "Error: #{params[:position]} currently has no instructors."}
        end
      else
        render status: 404, json: {message: "Error: #{params[:position]} currently has no assignments."}
      end
    else
      render status: 404, json: {message: "Error: #{params[:position]} doesn't exist."}
    end
  end

  private
    def assignment_params
      params.permit(:position_id, :hours)
    end

    def updateable_attributes
      params.permit(:hours, :export_date)
    end

    def get_position_applicants(position)
      applicants = []
      Assignment.all.each do |assignment|
        if assignment[:position_id] == position[:id]
          applicant = Applicant.find(assignment[:applicant_id])
          if applicant
            applicants.push({
              last_name: applicant[:last_name],
              first_name: applicant[:first_name],
              hours: assignment[:hours],
              utorid: applicant[:utorid],
              email: applicant[:email]
            })
          end
        end
      end
      return applicants.sort_by { |item| item[:last_name] }
    end

    def set_domain
      ENV["domain"] = request.base_url
    end

end
