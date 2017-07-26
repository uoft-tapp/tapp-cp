class OffersController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: get_all_offers
  end

  def show
    offer = Offer.find(params[:id])
    render json: offer.format
  end

  def show_by_instructor
    offers = get_all_offers.select { |offer| taught_by(offer, params[:instructor_id].to_i) }
    render json: offers
  end

  def update
    offer = Offer.find(params[:id])
    offer.update_attributes!(offer_params)
  end

  def send_contract
    offer = Offer.find(params[:offer_id])
    if !offer.contract
      CpMailer.contract_email([offer.format]).deliver_now
      offer.create_contract!(link: "mangled-link-for-accepting-offer")
      render json: {message: "You've just sent out the contract for this offer."}
    else
      render json: {message: "You've already sent out the contract for this offer."}
    end
  end

  private
  def offer_params
    params.permit(:objection)
  end

  def get_all_offers
    Offer.all.map do |offer|
      offer.format
    end
  end

  def taught_by(offer, instructor_id)
    offer[:instructors].each do |instructor|
      if instructor["id"] == instructor_id
        return true
      end
    end
    return false
  end

end
