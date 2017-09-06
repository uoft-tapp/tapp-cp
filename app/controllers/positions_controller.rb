class PositionsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :tapp_admin

  def index
    if params[:utorid]
      positions = []
      Position.all.includes(:instructors).each do |position|
        if get_utorids(position).include?(params[:utorid])
          positions.push(position)
        end
      end
      render json: positions.to_json(include: [:instructors])
    else
      positions = Position.all.includes(:instructors)
      render json: positions.to_json(include: [:instructors])
    end
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
    update_date(params[:start_date], position, :start_date)
    update_date(params[:end_date], position, :end_date)
  end

  private
  def position_params
    params.permit(:duties, :qualifications, :hours, :estimated_count,
      :estimated_total_hours, :open, :current_enrollment, :cap_enrollment, :num_waitlisted)
  end

  def update_date(date, position, attribute)
    if date
      date = Date.parse(date)
      if date
        position.update_attributes!(attribute => date)
      end
    end
  end

  def get_utorids(position)
    utorids = []
    position.instructors.each do |instructor|
      utorids.push(instructor[:utorid])
    end
    return utorids
  end

end
