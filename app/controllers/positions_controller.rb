class PositionsController < ApplicationController
  include Importer
  protect_from_forgery with: :null_session
  include Authorizer
  include Model
  before_action :tapp_admin, except: [:index, :show]
  before_action :either_admin_instructor, only: [:index, :show]

  def index
    if params[:session_id]
      if params[:utorid]
        render json: get_all_positions_for_utorid(params[:utorid], params[:session_id])
      else
        positions = positions_from_session(params[:session_id])
        render json: positions.to_json(include: [:instructors])
      end
    else
      if params[:utorid]
        render json: get_all_positions_for_utorid(params[:utorid])
      else
        positions = Position.all.includes(:instructors)
        render json: positions.to_json(include: [:instructors])
      end
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
  
  def add_or_update
    exceptions = []
    session = params[:session_id]
    positions = params[:positions]
    begin
      positions.each do |course_entry|
        posting_id  = course_entry["course_id"]
        course_id = posting_id
        round_id = course_entry["round_id"]
        dates = get_dates(course_entry["dates"])
        if !dates
          dates = [nil, nil]
          exceptions.push("Error: The dates for Position #{course_entry["course_id"]} is malformed.")
        end
        exists = "Position #{posting_id} already exists"
        ident = {position: posting_id, round_id: round_id}
        campus_code = 1
        data = {
          position: posting_id,
          round_id: round_id,
          open: true,
          campus_code: campus_code,
          course_name: (course_entry["course_name"] || "").strip,
          current_enrolment: course_entry["enrolment"],
          duties: course_entry["duties"],
          qualifications: course_entry["qualifications"],
          hours: course_entry["n_hours"] || 0,
          estimated_count: course_entry["n_positions"] || 0,
          estimated_total_hours: course_entry["total_hours"],
          session_id: session,
          start_date: dates[0],
          end_date: dates[1],
        }
        position = insertion_helper(Position, data, ident, exists)
      end
    rescue
      exceptions.push("Error: Unknown error when creating Position")
    end


    if exceptions.length > 0
      status = {success: true, errors: true, message: exceptions}
    else
      status = {success: true, errors: false, message: ["Positions import was successful."]}
    end
    
    if status[:success]
      render json: {errors: status[:errors], message: status[:message]}
    else
      render status: 404, json: {message: status[:message], errors: status[:errors]}
    end
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
    all_positions = positions_from_session(session)
    all_positions.each do |position|
      position[:instructors].each do |instructor|
        if instructor[:utorid] == utorid
          positions.push(position)
        end
      end
    end
    return positions
  end

  def get_dates(dates)
    if dates
      dates = dates.split(" to ")
      if dates.size == 2
        return dates
      else
        dates = dates[0].split(" - ")
        if dates.size == 2
          return dates
        end
      end
    end
  end

end
