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
      offer.create_contract!(link: "mangled-link-for-accepting-offer")
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
    Offer.all.map do |offer|
      format_offer(offer)
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

  def format_offer(offer_rec)
    offer = offer_rec.as_json
    position = Position.find(offer["position_id"]).as_json
    applicant = Applicant.find(offer["applicant_id"]).as_json
    instructors = position["instructors"].as_json
    data = {
      sent: offer_rec.contract.present?,
      position: position["position"],
      applicant: applicant,
      instructors: [],
    }
    if data[:sent]
      data[:deadline] = offer_rec.get_deadline
      data[:accepted] = offer_rec.contract[:accepted]
      data[:withdrawn] = Time.now > data[:deadline]
    end
    instructors.each do |instructor|
      data[:instructors].push(instructor)
    end
    return offer.merge(data)
  end

end
