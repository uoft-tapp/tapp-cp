class TemplatesController < ApplicationController
  protect_from_forgery with: :null_session
  include DdahUpdater
  include Authorizer
  include Model
  before_action :either_cp_admin_instructor, except: [:preview]
  before_action only: [:preview] do
    both_cp_admin_instructor(Template)
  end

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
      if templates.include?(params[:id].to_i)
        template = Template.find(params[:id])
        render status: 200, json: template.format
      else
        render status: 404, json: {status: 404}
      end
    else
      template = Template.find(params[:id])
      render json: template.format
    end
  end

  def create
    instructor = Instructor.find_by!(utorid: params[:utorid])
    template = Template.find_by(name: params[:name], instructor_id: instructor[:id])
    if !template
      template = Template.create!(
        name: params[:name],
        instructor_id: instructor[:id],
      )
      render status: 201, json: template.to_json
    else
      render status: 404, json: {message: "Error: A template with the same name already exists."}
    end
  end

  def destroy
    template = Template.find(params[:id])
    if can_modify(params[:utorid], template)||params[:utorid]==nil
      template.allocations.each do |allocation|
        allocation.destroy!
      end
      template.destroy!
    else
      render status: 403, file: 'public/403.html'
    end
  end

  def update
    template = Template.find(params[:id])
    if can_modify(params[:utorid], template)||params[:utorid]==nil
      update_form(template, params)
    else
      render status: 403, file: 'public/403.html'
    end
  end

  def preview
    template = Template.find(params[:template_id])
    generator = DdahGenerator.new([template.format], true)
    send_data generator.render, filename: "ddah_template.pdf", disposition: "inline"
  end

  private
  def can_modify(utorid, template)
    instructor = Instructor.find_by(utorid: utorid)
    if instructor
      return template[:instructor_id].to_i == instructor[:id]
    else
      return false
    end
  end

  def get_all_templates(templates)
    templates.map do |template|
      template.format
    end
  end

  def get_all_templates_for_utorid(utorid)
    templates = []
    instructor = Instructor.find_by(utorid: utorid)
    if instructor
      Template.all.each do |template|
        if template[:instructor_id] == instructor[:id]
          templates.push(template)
        end
      end
    end
    return templates
  end


end
