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

  def pref_is_from_session(preferences, session)
    preferences.each do |pref|
      position = Position.find(pref[:position_id])
      if position[:session_id] == session.to_i
        return true
      end
    end
    return false
  end

  def applications_is_from_session(applications, session)
    applications.each do |application|
      if pref_is_from_session(application.preferences, session)
        return true
      end
    end
    return false
  end

  def get_applicants_from_session(session)
    applicants = []
    Applicant.all.each do |applicant|
      if applications_is_from_session(applicant.applications, session)
        applicants.push(applicant)
      end
    end
    return applicants
  end


end
