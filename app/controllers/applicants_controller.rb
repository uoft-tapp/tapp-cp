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
      render json: applicants_from_session(params[:session_id])
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
    params.permit(:commentary,
      :utorid,
      :student_number,
      :first_name,
      :last_name,
      :email,
      :phone,
      :address,
      :dept,
      :program_id)
  end

end
