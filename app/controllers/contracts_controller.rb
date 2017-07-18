class ContractsController < ApplicationController
  protect_from_forgery with: :exception

  def index
    render json: Contract.all.to_json
  end

  def show
    render json: Contract.find(params[:id]).to_json
  end
end
