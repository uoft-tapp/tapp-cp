class ApplicantsController < ApplicationController
  # protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  include Authorizer
  before_action :admin_or_instructor

'''
  index #GET
    /applicants/
'''
  def index
    if session[:roles].include?("tapp_admin")
      render json: Applicant.all
    elsif params[:session_id]
      render json: applicants_from_session(params[:session_id], session[:utorid])
    else
      render file: 'public/403.html'
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

end
