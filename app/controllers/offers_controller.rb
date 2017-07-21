class OffersController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: get_all_offers
  end

  def show
    offer = Offer.find(params[:id])
    render json: format_offer(offer)
  end

  def show_by_instructor
    offers = []
    get_all_offers.each do |offer|
      if taught_by(offer, params[:instructor_id].to_i)
        offers.push(offer)
      end
    end
    render json: offers
  end

  def update
    offer = Offer.find(params[:id])
    offer.update_attributes!(offer_params)
  end

  def send_contract
    offer = Offer.find(params[:id])
    if !offer.contract
      offer.create_contract!(
        link: "my secret",
        deadline: Time.now + (2*7*24*60*60)
      )
      # send out contract by email
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
    offers = []
    Offer.all.each do |offer|
      offers.push(format_offer(offer))
    end
    return offers
  end

  def taught_by(offer, instructor_id)
    found = false
    offer["instructors"].each do |instructor|
      if instructor["id"] == instructor_id
        found = true
      end
    end
    return found
  end

  def format_offer(offer)
    sent = (offer.contract)? true:false
    offer = offer.as_json
    offer["sent"] = sent
    position = Position.find(offer["position_id"]).as_json
    offer["position"] = position["position"]
    applicant = Applicant.find(offer["applicant_id"]).as_json
    offer["applicant"] = applicant
    instructors = position["instructors"].as_json
    offer["instructors"] = []
    instructors.each do |instructor|
      offer["instructors"].push(instructor)
    end
    return offer
  end

end
