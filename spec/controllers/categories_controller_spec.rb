require 'rails_helper'

RSpec.describe CategoriesController, type: :controller do

  let(:category) do
    Category.create!(
      name: "category name",
    )
  end

  describe "GET /categories/" do
    context "when expected" do
      it "lists all categories" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /categories/{id} exists" do
      it "lists categories with {id}" do
        get :show, params: {id: category[:id]}
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
