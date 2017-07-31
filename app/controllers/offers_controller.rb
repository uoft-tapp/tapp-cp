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
      offer.update_attributes!(status: "Pending")
      offer.create_contract!(link: "mangled-link-for-accepting-offer")
      render json: {message: "You've just sent out the contract for this offer."}
    else
      render json: {message: "You've already sent out the contract for this offer."}
    end
  end

  def reject
    offer = Offer.find(params[:offer_id])
    if offer[:status] == "Pending"
      offer.update_attributes!(status: "Rejected")
      render json: {message: "You've just rejected this offer."}
    elsif offer[:status] == "Unsent"
      render json: {message: "You cannot reject an unsent offer."}
    else
      render status: 404, json: {message: "You cannot reject this offer. This offer has already been #{offer[:status].downcase}."}
    end
  end

  def accept
    offer = Offer.find(params[:offer_id])
    if offer[:status] == "Pending"
      offer.update_attributes!(status: "Accepted")
      render json: {message: "You've just Accepted this offer."}
    elsif offer[:status] == "Unsent"
      render json: {message: "You cannot accept an unsent offer."}
    else
      render status: 404, json: {message: "You cannot accept this offer. This offer has already been #{offer[:status].downcase}."}
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
      if instructor[:id] == instructor_id
        return true
      end
    end
    return false
  end

end
