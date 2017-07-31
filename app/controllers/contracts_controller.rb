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

  def nag
    if params[:contracts] && params[:contracts]!=""
      JSON.parse(params[:contracts]).each do |id|
        contract = Contract.find(id)
        if contract
          contract.increment!(:nag_count, 1)
          CpMailer.nag_email(contract.format).deliver_now
        end
      end
      render json: {message: "You've sent the nag emails."}
    end
  end

  def print
    if params[:contracts] && params[:contracts]!=""
      offers = get_printable_data(JSON.parse(params[:contracts]))
      generator = ContractGenerator.new(offers)
      send_data generator.render, filename: "contracts.pdf", disposition: "inline"
    end
  end

  private
  def contract_params
    params.permit(:printed)
  end

  def get_printable_data(contracts)
    offers = []
    contracts.each do |id|
      contract = Contract.find(id)
      offer = Offer.find(contract[:id])
      if offer
        offers.push(offer.format)
      end
    end
    return offers
  end

end
