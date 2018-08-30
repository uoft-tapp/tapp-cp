class TasksController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :admin_or_instructor

  def index
    tasks = Task.all
    render json: tasks.to_json
  end

  def show
    task = Task.find(params[:id])
    render json: task.to_json
  end

end
