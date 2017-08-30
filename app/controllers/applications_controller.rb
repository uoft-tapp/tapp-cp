class ApplicationsController < ApplicationController
  include Authorizer
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
end
