class OffersController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: get_all_offers
  end

  def show
    offer = Offer.find(params[:id])
    render json: offer.format
  end

  def send_contract
    offer = Offer.find(params[:offer_id])
    if !offer[:send_date]
      if ENV['RAILS_ENV'] != 'test'
        CpMailer.contract_email(offer.format).deliver_now
      end
      offer.update_attributes!({status: "Pending", send_date: DateTime.now.to_s})
      render json: {message: "You've just sent out the contract for this offer."}
    else
      render json: {message: "You've already sent out the contract for this offer."}
    end
  end

  def batch_email_nags
    if params[:contracts] && params[:contracts]!=""
      JSON.parse(params[:contracts]).each do |id|
        offer = Offer.find(id)
        if offer
          offer.increment!(:nag_count, 1)
          if ENV['RAILS_ENV'] != 'test'
            CpMailer.nag_email(offer.format).deliver_now
          end
        end
      end
      render json: {message: "You've sent the nag emails."}
    end
  end

  def combine_contracts_print
    if params[:contracts] && params[:contracts]!=""
      offers = get_printable_data(JSON.parse(params[:contracts]))
      generator = ContractGenerator.new(offers)
      send_data generator.render, filename: "contracts.pdf", disposition: "inline"
    end
  end

  def set_status
    status = get_status(params[:code])
    offer = Offer.find(params[:offer_id])
    if offer[:status] == "Pending"
      offer.update_attributes!({status: status[:name]})
      render json: {success: true, status: status[:name].downcase, message: "You've just #{status[:name].downcase} this offer."}
    elsif offer[:status] == "Unsent"
      render status: 404, json: {success: false, message: "You cannot #{status[:action]} an unsent offer."}
    else
      render status: 404, json: {success: false, message: "You cannot reject this offer. This offer has already been #{offer[:status].downcase}."}
    end
  end

  def update_hr_status
    puts "update_hr_status"
  end

  private
  def get_all_offers
    Offer.all.map do |offer|
      offer.format
    end
  end

  def get_printable_data(contracts)
    offers = []
    contracts.each do |id|
      offer = Offer.find(id)
      if offer
        offers.push(offer.format)
      end
    end
    return offers
  end

  def get_status(code)
    case code
    when "accept"
      return {name: "Accepted", action: "accept"}
    when "reject"
      return {name: "Rejected", action: "reject"}
    when "withdraw"
      return {name: "Withdrawn", action: "withdraw"}
    end
  end

end
