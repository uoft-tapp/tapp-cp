require 'rails_helper'

RSpec.describe DutiesController, type: :controller do

  let(:duty) do
    Duty.create!(
      name: "duty name",
    )
  end

  describe "GET /duties/" do
    context "when expected" do
      it "lists all duties" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /duties/{id} exists" do
      it "lists duties with {id}" do
        get :show, params: {id: duty[:id]}
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
