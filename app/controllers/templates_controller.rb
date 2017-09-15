class TemplatesController < ApplicationController
  protect_from_forgery with: :null_session
  include DdahUpdater
  include Authorizer
  include Model
  before_action :either_cp_admin_instructor, except: [:preview]
  before_action :both_cp_admin_instructor, only: [:preview]

  def index
    if params[:utorid]
      render json: get_all_templates(get_all_templates_for_utorid(params[:utorid]))
    else
      render json: get_all_templates(Template.all)
    end
  end

  def show
    if params[:utorid]
      templates = id_array(get_all_templates_for_utorid(params[:utorid]))
      if templates.include?(params[:id])
        template = Template.find(params[:id])
        render json: template.format
      else
        render status: 404, json: {status: 404}
      end
    else
      template = Template.find(params[:id])
      render json: template.format
    end
  end

  def create
    position = Position.find(params[:position_id])
    instructor = Instructor.find_by!(utorid: params[:utorid])
    template = Template.find_by(name: params[:name], position_id: position[:id])
    if !template
      Template.create!(
        position_id: position[:id],
        name: params[:name],
        instructor_id: instructor[:id],
      )
      render status: 200, json: {message: "A Template has been successfully created."}
    else
      render status: 404, json: {message: "Error: A template with the same name already exists."}
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
    update_form(template, params)
    template.update_attributes!(template_params)
  end

  def preview
    template = Template.find(params[:template_id])
    generator = DdahGenerator.new(template.format, true)
    send_data generator.render, filename: "ddah_template.pdf", disposition: "inline"
  end

  private
  def template_params
    params.permit(:name, :optional, :scaling_learning)
  end

  def get_all_templates(templates)
    templates.map do |template|
      template.format
    end
  end

  def get_all_templates_for_utorid(utorid)
    templates = []
    Template.all.each do |template|
      position = Position.find(template[:position_id])
      position.instructors.each do |instructor|
        if instructor[:utorid] == utorid
          templates.push(template)
        end
      end
    end
    return templates
  end


end
