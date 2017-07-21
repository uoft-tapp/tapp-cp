class ContractsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    contracts = []
    Contract.all.as_json.each do |contract|
      contracts.push(format_contract(contract))
    end
    render json: contracts
  end

  def show
    contract = Contract.find(params[:id]).as_json
    render json: format_contract(contract)
  end

  def update
    contract = Contract.find(params[:id])
    contract.update_attributes!(contract_params)
  end

  private
  def contract_params
    params.permit(:accepted, :withdrawn, :printed)
  end

  def format_contract(contract)
    position = Position.find(contract["id"]).as_json
    contract["position"] = position["position"]
    applicant = Applicant.find(contract["id"]).as_json
    contract["applicant"] = applicant
    return contract
  end

end
