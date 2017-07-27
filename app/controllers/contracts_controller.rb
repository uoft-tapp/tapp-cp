class ContractsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    contracts = Contract.all.includes(:offer).map { |c| format_contract(c) }
    render json: contracts
  end

  def show
    contract = Contract.find(params[:id])
    render json: format_contract(contract)
  end

  def update
    contract = Contract.find(params[:id])
    contract.update_attributes!(contract_params)
  end

  def nag
    contract = Contract.find(params[:contract_id])
    # send out email remainders
    contract.increment!(:nag_count, 1)
    render json: {message: "You've nagged at this applicant for the #{contract[:nag_count]}-th time."}
  end

  private
  def contract_params
    params.permit(:accepted, :printed)
  end

  def format_contract(contract)
    offer = contract.offer
    deadline = contract.get_deadline
    contract = contract.as_json
    position = Position.find(offer[:position_id]).as_json
    applicant = Applicant.find(offer[:applicant_id]).as_json
    return contract.merge({
      position: position["position"],
      applicant: applicant,
      deadline: deadline,
      contract: Time.now > deadline,
    })
  end

end
