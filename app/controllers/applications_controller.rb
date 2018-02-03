class ApplicationsController < ApplicationController
  include Authorizer
  include Model
  before_action :tapp_admin

'''
  index #GET
    /applications/ - returns all applications
    /applicant/:applicant_id/applications - returns applications of a certain applicant

    Both endpoints include an applicants preferences for each application
'''
  def index
    # present? - checks if the applicant_id is present in the request
    @applications = if params[:applicant_id].present?
      # Since Applicants are associated to applications
      Applicant.find(params[:applicant_id]).applications.includes(:preferences)
    elsif params[:session_id].present?
      get_applications_from_session(params[:session_id])
    else
      Application.includes(:preferences).all
    end

    render json: @applications.to_json(include: [:preferences])
  end

'''
  show #GET
    /applications/:id - returns an application based on the integer ID
'''
  def show
    @application = Application.includes(:preferences).find(params[:id])
    # convert preferences into json - since we did the grunt work before this will be easy -
    render json: @application.to_json(include: [:preferences])
  end

  private
  def get_applications_from_session(session)
    attr = Application.column_names.map {|i| "app.#{i}"}
    session_select = "SELECT p.id id FROM positions p WHERE p.session_id=#{session}"
    pref_select = "SELECT DISTINCT pref.application_id id FROM preferences pref, (#{session_select}) p WHERE p.id=pref.position_id"
    sql="SELECT DISTINCT #{attr.join(', ')} FROM applications app, (#{pref_select}) p WHERE p.id=app.id ORDER BY app.id"
    applications = execute_sql(sql)
    applications.each do |app|
      prefs = "SELECT * FROM preferences WHERE application_id=#{app[:id]}"
      app[:preferences] = execute_sql(prefs)
    end
    return applications
  end

end
