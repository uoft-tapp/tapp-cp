class ContractsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: Contract.all.to_json
  end

  def show
    render json: Contract.find(params[:id]).to_json
  end

  def update
    contract = Contract.find(params[:id])
    contract.update_attributes!(contract_params)
  end

  private
  def contract_params
    params.permit(:accepted, :withdrawn)
  end

end
