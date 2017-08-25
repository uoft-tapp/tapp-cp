require 'rails_helper'

RSpec.describe InstructorsController, type: :controller do

  let(:instructor) do
    Instructor.create!(
      name: "instructor name",
      email: "email@example.com"
    )
  end

  describe "GET /instructors/" do
    context "when expected" do
      it "lists all instructors" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /instructors/{id} exists" do
      it "lists instructors with {id}" do
        get :show, params: {id: instructor[:id]}
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
