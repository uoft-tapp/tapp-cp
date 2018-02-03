class ApplicantsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :tapp_admin

'''
  index #GET
    /applicants/
'''
  def index
    if params[:session_id]
      render json: get_applicants_from_session(params[:session_id])
    else
      render json: Applicant.all
    end
  end

'''
  show #GET
    /applicants/:id
'''
  def show
    @applicants = Applicant.find(params[:id])
    render json: @applicants.to_json
  end

'''
  update #PATCH
    /applicants/:id
'''
  def update
    applicant = Applicant.find(params[:id])
    if applicant.update_attributes(applicant_params)
      render json: applicant.to_json
    else
      render json: applicant.errors.to_hash(true), status: :unprocessable_entity
    end
  end

  private
  def applicant_params
    params.permit(:commentary)
  end

  def get_applicants_from_session(session)
    attr = Applicant.column_names.map {|i| "app.#{i}"}
    session_select = "SELECT p.id id FROM positions p WHERE p.session_id=#{session}"
    pref_select = "SELECT DISTINCT pref.application_id id FROM preferences pref, (#{session_select}) p WHERE p.id=pref.position_id"
    application_select="SELECT DISTINCT app.applicant_id id FROM applications app, (#{pref_select}) p WHERE p.id=app.id"
    sql="SELECT DISTINCT #{attr.join(', ')} FROM applicants app, (#{application_select}) p WHERE p.id=app.id ORDER BY app.id"
    return execute_sql(sql)
  end


end
