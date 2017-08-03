require 'rails_helper'

RSpec.describe ContractsController, type: :controller do

  let(:offer) do
    Offer.create!(
        position_id: 6,
        applicant_id: 1,
        hours: 60
    )
  end
  let(:contract) do
    offer.create_contract!(link: "my link")
  end


  describe "GET /contracts/" do
    context "when expected" do
      it "lists all contracts" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /contracts/{id} exists" do
      it "lists contracts with {id}" do
        get :show, params: {id: contract[:id]}
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
  end

  describe "POST /contracts/" do
    context ":id/nag" do
      before(:each) do
        expect(contract[:nag_count]).to eq(0)
      end
      it "return a message of the number of time a applicant has been nagged at" do
        post :nag, params: {id: contract[:id]}
        contract.reload
        expect(response.status).to eq(200)
        expect(contract[:nag_count]).to eq(1)
        expect(response.body).to eq({
          message: "You've nagged at this applicant for the #{contract[:nag_count]}-th time."
        }.to_json)
      end
    end
  end

  describe "PATCH /contracts/:id" do
    before(:each) do
      expect(contract[:accepted]).to eq(false)
      expect(contract[:printed]).to eq(false)
    end
    it "returns status 204 and updates contract" do
      patch :update, params: {id: contract[:id], accepted: true, printed: true}
      contract.reload
      expect(response.status).to eq(204)
      expect(contract[:accepted]).to eq(true)
      expect(contract[:printed]).to eq(true)
    end
  end


end
