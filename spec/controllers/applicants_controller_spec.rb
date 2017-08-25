require 'rails_helper'

RSpec.describe ApplicantsController, type: :controller do
  let (:parsed_body) { JSON.parse(response.body) }

  describe "GET #index" do
    it "list applicants" do
      get :index
      expect(response.status).to eq(200)
      expect(response.body).not_to be_empty
    end
  end

  describe "GET #show" do
    context "when passed an integer ID" do
      let(:applicant) do
        Applicant.create!(
          utorid: "simps169",
          app_id: "10",
          student_number: 1234567890,
          first_name: "Landy",
          last_name: "Simpson",
          email: "simps@mail.com",
          phone: "4165558888",
          address: "100 Jameson Ave Toronto, ON M65-48H")
      end

      let(:parsed_body) { JSON.parse(response.body) }

      it "returns the applicant associated to the integer ID" do
        get :show, params: { id: applicant.id }, format: :json
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include(applicant.attributes.except("created_at", "updated_at"))
      end
    end

    context "when passed a non-integer ID" do
      it "it returns 404" do
        get :show, params: { id: "poop" }
        expect(response.status).to eq(404)
      end
    end
  end

  describe "PATCH #update" do
    let(:applicant) do
      Applicant.create!(
        utorid: "simps169",
        app_id: "10",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        email: "simps@mail.com",
        phone: "4165558888",
        address: "100 Jameson Ave Toronto, ON M65-48H",
        commentary: ""
        )
    end

    context "when valid parameter is passed" do
      it "returns status 200 and the JSON of updated applicant" do
        commentary = "Hello World"
        patch :update, params: { id: applicant.id, commentary: commentary }
        expect(response.status).to eq(200)
        expect(parsed_body["commentary"]).to eq(commentary)
      end
    end

    context "when invalid parameter is passed" do
      it "returns a 200 status and ignores the extra parameter" do
        patch :update, params: { id: applicant.id, random: "data" }
        expect(response.status).to eq(200)
        expect(parsed_body["commentary"]).to eq(applicant[:commentary])
      end
    end

  end
end
