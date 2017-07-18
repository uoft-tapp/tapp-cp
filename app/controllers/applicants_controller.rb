class ApplicantsController < ApplicationController
  protect_from_forgery with: :exception

  def index
    render json: Applicant.all.to_json
  end

  def show
    render json: Applicant.find(params[:id]).to_json
  end
end
