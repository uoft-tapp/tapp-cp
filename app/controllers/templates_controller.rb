class TemplatesController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access

  def index
    render json: Template.all.to_json
  end

  def show
    template = Template.find(params[:id])
    render json: template.to_json
  end

end
