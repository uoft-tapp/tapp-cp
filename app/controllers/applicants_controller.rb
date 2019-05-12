class ApplicantsController < ApplicationController
  include Importer
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
  
  def add_or_update
    exceptions = []
    applicants = params[:applicants]
    begin
      applicants.each do |applicant_entry|
        utorid = applicant_entry["utorid"]
        ident = {utorid: utorid}
        exists = "applicant #{utorid} already exists"
        data = {
            utorid: utorid,
            app_id: applicant_entry["app_id"].to_i,
            student_number: applicant_entry["student_no"],
            first_name:applicant_entry["first_name"],
            last_name: applicant_entry["last_name"],
            email:applicant_entry["email"],
            phone: applicant_entry["phone"],
            dept: applicant_entry["dept"],
            program_id: applicant_entry["program_id"],
            yip: applicant_entry["yip"],
            address:applicant_entry["address"],
            commentary: "",
            full_time: applicant_entry["full_time"],
        }
        insertion_helper(Applicant, data, ident, exists)
      end
    rescue
      exceptions.push("Error: error encountered while adding applicants")
    end

    if exceptions.length > 0
      status = {success: true, errors: true, message: exceptions}
    else
      status = {success: true, errors: false, message: ["Applicants import was successful."]}
    end
    
    if status[:success]
      render json: {errors: status[:errors], message: status[:message]}
    else
      render status: 404, json: {message: status[:message], errors: status[:errors]}
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
