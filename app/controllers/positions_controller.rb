class PositionsController < ApplicationController
  include Authorizer
  around_action :is_admin
  protect_from_forgery with: :null_session

  def index
    @positions = Position.all.includes(:instructors)
    render json: @positions.to_json(include: [:instructors])
  end

  def show
    position = Position.includes(:instructors).find(params[:id])
    render json: position.to_json(include: [:instructors])
  end

  def update
    position = Position.find(params[:id])
    position.update_attributes!(position_params)
    if params[:instructors]
      position.instructor_ids = params[:instructors]
    end
  end

  private
  def position_params
    params.permit(:duties, :qualifications, :hours, :estimated_count,
      :estimated_total_hours, :open, :current_enrollment, :cap_enrollment, :num_waitlisted)
  end

end
