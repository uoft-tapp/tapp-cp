require 'rails_helper'
RSpec.describe SessionsController, type: :controller do

  let(:session) do
    Session.find(1).json
  end


  describe "GET /sessions/" do
    context "when expected" do
      it "lists all sessions" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /sessions/{id} exists" do
      it "lists session with {id}" do
        get :show, params: {id: session[:id]}
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

  describe "PATCH /sessions/:id" do
    context "when a number" do
      it "updates the session" do
        pay = session[:pay]
        patch :update, params: {id: session[:id], session: {pay: 100}}
        session = Session.find(1).json
        expect(response.status).to eq(204)
        expect(session[:pay]).to eq(100)
        patch :update, params: {id: session[:id], session: {pay: pay}}
        session = Session.find(1).json
        expect(response.status).to eq(204)
        expect(session[:pay]).to eq(pay)
      end
    end

    context "when not a number" do
      it "does not update the session" do
        pay = session[:pay]
        patch :update, params: {id: session[:id], session: {pay: "poop"}}
        expect(response.status).to eq(204)
        expect(session[:pay]).to eq(pay)
      end
    end
  end


end
