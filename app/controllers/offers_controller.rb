class OffersController < ApplicationController
  protect_from_forgery with: :null_session
  
  def index
    render json: get_all_offers
  end

  def show
    offer = Offer.find(params[:id]).as_json
    render json: format_offers(offer)
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

  private
  def offer_params
    params.permit(:objection)
  end

  def get_all_offers
    offers = []
    Offer.all.as_json.each do |offer|
      offers.push(format_offers(offer))
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

  def format_offers(offer)
    puts offer[:id]
    position = Position.find(offer["id"]).as_json
    offer["position"] = position["position"]
    applicant = Applicant.find(offer["id"]).as_json
    offer["applicant"] = applicant
    instructors = position["instructors"].as_json
    offer["instructors"] = []
    instructors.each do |instructor|
      offer["instructors"].push(instructor)
    end
    return offer
  end

end
