class TemplatesController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  include Model
  before_action :cp_access

  def index
    if params[:utorid]
      render json: get_all_templates_for_utorid(params[:utorid])
    else
      render json: Template.all.to_json
    end
  end

  def show
    if params[:utorid]
      templates = id_array(get_all_templates_for_utorid(params[:utorid]))
      if templates.include?(params[:id])
        template = Template.find(params[:id])
        render json: template.to_json
      else
        render status: 404, json: {status: 404}
      end
    else
      template = Template.find(params[:id])
      render json: template.to_json
    end
  end

  def destroy
    template = Template.find(params[:id])
    template.allocations.each do |allocation|
      allocation.destroy!
    end
    template.destroy!
  end

  def update
    template = Template.find(params[:id])
    template.update_attributes!(template_params)
    if params[:categories]
      template.category_ids = params[:categories]
    end
    if params[:trainings]
      template.training_ids = params[:trainings]
    end
  end

  private
  def template_params
    params.permit(:name, :optional)
  end

  def get_all_templates_for_utorid(utorid)
    templates = []
    Template.all.each do |template|
      offer = Offer.find(template[:offer_id])
      position = Position.find(offer[:position_id])
      position.instructors.each do |instructor|
        if instructor[:utorid] == utorid
          templates.push(template)
        end
      end
    end
    return templates
  end


end
