require 'rails_helper'

RSpec.describe OffersController, type: :controller do

  let(:offer) do
    Offer.create!(
        position_id: 6,
        applicant_id: 1,
        hours: 60
    )
  end

  describe "GET /offers/" do
    context "when expected" do
      it "lists all offers" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /offers/{id} exists" do
      it "lists offers with {id}" do
        get :show, params: {id: offer[:id]}
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when {id} is a non-existent id" do
      it "throws status 404" do
        get :show, params: {id: "poop"}
        expect(response.status).to eq(404)
      end
    end

    context "when /offers/instructor/{instructor_id}" do
      it "returns all offers made for the course instructor {instructor_id} is teaching" do
        get :show_by_instructor, params: {instructor_id: 1}
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end
  end

  describe "POST /offers/" do
    context ":offer_id/send-contract" do
      before(:each) do
        expect(offer.contract).to eq(nil)
      end
      it "returns a message of whether the contract has been sent" do
        post :send_contract, params: {offer_id: offer[:id]}
        offer.reload
        expect(response.status).to eq(200)
        expect(response.body).to eq({
          message: "You've just sent out the contract for this offer."
        }.to_json)
        expect(offer.contract.as_json).not_to be_empty
        post :send_contract, params: {offer_id: offer[:id]}
        offer.reload
        expect(response.status).to eq(200)
        expect(offer.contract.as_json).not_to be_empty
        expect(response.body).to eq({
          message: "You've already sent out the contract for this offer."
        }.to_json)
      end
    end
  end

  describe "PATCH /offers/:id" do
    before(:each) do
      expect(offer[:objection]).to eq(false)
    end
    it "returns status 204 and updates offer" do
      patch :update, params: {id: offer[:id], objection: true}
      offer.reload
      expect(response.status).to eq(204)
      expect(offer[:objection]).to eq(true)
    end
  end

end
