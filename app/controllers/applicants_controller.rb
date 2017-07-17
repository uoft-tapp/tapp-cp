class ApplicantsController < ApplicationController
  protect_from_forgery with: :exception

  def index
    puts "hello world"
    @applicants = Applicant.all
    render json: @applicants.to_json
  end

  def show
    @applicants = Applicant.find(params[:id])
    render json: @applicants.to_json
  end
end
