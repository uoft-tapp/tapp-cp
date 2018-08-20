class PositionsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  include Model
  before_action :tapp_admin, except: [:index, :show]
  before_action :either_admin_instructor, only: [:index, :show]

  def index
    if params[:session_id]
      positions = positions_from_session(params[:session_id])
      render json: positions.to_json(include: [:instructors])
    end
  end

  def show
    if params[:utorid]
      positions = id_array(get_all_positions_for_utorid(params[:utorid]))
      if positions.include?(params[:id])
        position = Position.find(params[:id])
        render json: position.format
      else
        render status: 404, json: {status: 404}
      end
    else
      position = Position.includes(:instructors).find(params[:id])
      render json: position.to_json(include: [:instructors])
    end
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
      :estimated_total_hours, :open, :current_enrolment, :cap_enrolment, :num_waitlisted)
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

  def get_all_positions_for_utorid(utorid, session = nil)
    positions = []
    all_positions = positions_from_session(session, utorid)
    all_positions.each do |position|
      position.instructors.each do |instructor|
        if instructor[:utorid] == utorid
          positions.push(position)
        end
      end
    end
    return positions
  end



end
