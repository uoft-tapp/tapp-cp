class DdahsController < ApplicationController
  protect_from_forgery with: :null_session
  include DdahUpdater
  include Authorizer
  include Model
  before_action :cp_access

  def index
    if params[:utorid]
      render json: get_all_ddah_for_utorid(params[:utorid])
    else
      render json: Ddah.all.to_json
    end
  end

  def show
    if params[:utorid]
      ddahs = id_array(get_all_ddah_for_utorid(params[:utorid]))
      if ddahs.include?(params[:id])
        ddah = Ddah.find(params[:id])
        render json: ddah.to_json
      else
        render status: 404, json: {status: 404}
      end
    else
      ddah = Ddah.find(params[:id])
      render json: ddah.to_json
    end
  end

  def create
    offer = Offer.find(params[:offer_id])
    instructor = Instructor.find_by!(params[:utorid])
    if params[:use_template]
      offer.ddahs.create!(
        template_id: params[:template_id],
      )
    else
      offer.ddahs.create!(
        instructor_id: instructor[:id],
        optional: true,
      )
    end
  end

  def destroy
    ddah = Ddah.find(params[:id])
    ddah.allocations.each do |allocation|
      allocation.destroy!
    end
    ddah.destroy!
  end

  def update
    ddah = Ddah.find(params[:id])
    ddah.update_attributes!(ddah_params)
    update_form(ddah, param)
  end

  private
  def ddah_params
    params.permit(:optional)
  end

  def get_all_ddah_for_utorid(utorid)
    ddahs = []
    Ddah.all.each do |ddah|
      offer = Offer.find(ddah[:offer_id])
      position = Position.find(offer[:position_id])
      position.instructors.each do |instructor|
        if instructor[:utorid] == utorid
          ddahs.push(ddah)
        end
      end
    end
    return ddahs
  end

end
