class TemplatesController < ApplicationController
  # protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  include Authorizer
  include SessionSeparate
  before_action :either_cp_admin_instructor

  def index
    render json: get_all_templates(params[:session_id],params[:utorid])
  end

  def update
    template = Template.find(params[:id])
    if template
      template.task_ids = params[:tasks]
    end
  end

  private
  def get_all_templates(session, utorid)
    templates_from_session(session, utorid).map do |template|
      template.format
    end
  end

end
