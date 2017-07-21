require 'rails_helper'

RSpec.describe ApplicantsController, type: :controller do

  describe "GET /applicants/" do
    context "when expected" do
      it "lists all applicants" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /applicants/{id} exists" do
      it "lists applicant with {id}" do
        applicant = Applicant.find(1).as_json
        get :show, params: {id: applicant["id"]}
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

end
