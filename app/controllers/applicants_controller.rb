class ApplicantsController < ApplicationController
  include Authorizer
  around_action :is_admin
  protect_from_forgery with: :null_session
'''
  index #GET
    /applicants/
'''
  def index
    @applicants = Applicant.all
    render json: @applicants.to_json
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
