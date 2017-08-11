require 'rails_helper'

RSpec.describe ContractsController, type: :controller do

  let(:offer) do
    Offer.create!(
        position_id: 6,
        applicant_id: 1,
        hours: 60,
        status: "Pending"
    )
  end
  let(:unsent_offer) do
    Offer.create!(
        position_id: 6,
        applicant_id: 2,
        hours: 60,
        status: "Unsent"
    )
  end
  let(:accepted_offer) do
    Offer.create!(
        position_id: 6,
        applicant_id: 3,
        hours: 60,
        status: "Accepted"
    )
  end
  let(:contract) do
    offer.create_contract!(link: "my link")
  end
  let(:unsent_contract) do
    unsent_offer.create_contract!(link: "my link")
  end
  let(:accepted_contract) do
    accepted_offer.create_contract!(link: "my link")
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

  describe "POST /contracts/"
    context "nag" do
      before(:each) do
        expect(contract[:nag_count]).to eq(0)
      end
      it "return a message of the number of time a applicant has been nagged at" do
        post :batch_email_nags, params: {contracts: ([contract[:id]]).to_s}
        contract.reload
        expect(response.status).to eq(200)
        expect(contract[:nag_count]).to eq(1)
        res = ({ message: "You've sent the nag emails."}).to_json
        expect(response.body).to eq(res)
      end
    end

    context ":contract_id/decision/:code" do
      context "when contract_id doesn't exists" do
        it "returns a status 404" do
          post :set_status, params: {contract_id: "poop", code: "accept"}
          expect(response.status).to eq(404)
        end
      end
      context "when contract_id does exists" do
        context "when status is pending" do
          context "code = accept" do
            it "updates the contract status to Accepted" do
              post :set_status, params: {contract_id: contract[:id], code: "accept"}
              expect(response.status).to eq(200)
              body = {success: true, status: "accepted", message: "You've just accepted this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = reject" do
            it "updates the contract status to Rejected" do
              post :set_status, params: {contract_id: contract[:id], code: "reject"}
              expect(response.status).to eq(200)
              body = {success: true, status: "rejected", message: "You've just rejected this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = withdraw" do
            it "updates the contract status to Withdrawn" do
              post :set_status, params: {contract_id: contract[:id], code: "withdraw"}
              expect(response.status).to eq(200)
              body = {success: true, status: "withdrawn", message: "You've just withdrawn this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end
        end

        context "when status is unsent" do
          context "code = accept" do
            it "returns a status 404 with a message" do
              post :set_status, params: {contract_id: unsent_contract[:id], code: "accept"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot accept an unsent offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = reject" do
            it "updates the contract status to Rejected" do
              post :set_status, params: {contract_id: unsent_contract[:id], code: "reject"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot reject an unsent offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = withdraw" do
            it "updates the contract status to Withdrawn" do
              post :set_status, params: {contract_id: unsent_contract[:id], code: "withdraw"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot withdraw an unsent offer."}
              expect(response.body).to eq(body.to_json)
            end
          end
        end

        context "when status decided" do
          context "code = accept" do
            it "returns a status 404 with a message" do
              post :set_status, params: {contract_id: accepted_contract[:id], code: "accept"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot reject this offer. This offer has already been accepted."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = reject" do
            it "updates the contract status to Rejected" do
              post :set_status, params: {contract_id: accepted_contract[:id], code: "reject"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot reject this offer. This offer has already been accepted."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = withdraw" do
            it "updates the contract status to Withdrawn" do
              post :set_status, params: {contract_id: accepted_contract[:id], code: "withdraw"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot reject this offer. This offer has already been accepted."}
              expect(response.body).to eq(body.to_json)
            end
          end
        end
      end

    end

    context "print" do
      it "sends a PDF blob" do
        post :combine_contracts_print, params: {contracts: ([contract[:id]]).to_s}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"contracts.pdf\"")
      end
    end

end
