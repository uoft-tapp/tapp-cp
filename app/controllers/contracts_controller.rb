class ContractsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    contracts = Contract.all.map { |c| c.format }
    render json: contracts
  end

  def show
    contract = Contract.find(params[:id])
    render json: contract.format
  end

  def update
    contract = Contract.find(params[:id])
    contract.update_attributes!(contract_params)
  end


end
