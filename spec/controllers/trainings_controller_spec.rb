require 'rails_helper'

RSpec.describe TrainingsController, type: :controller do

  let(:training) do
    Training.create!(
      name: "training name",
    )
  end

  describe "GET /trainings/" do
    context "when expected" do
      it "lists all trainings" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /trainings/{id} exists" do
      it "lists trainings with {id}" do
        get :show, params: {id: training[:id]}
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
