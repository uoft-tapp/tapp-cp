require 'rails_helper'

RSpec.describe InstructorsController, type: :controller do

  let(:instructor) do
    Instructor.create!(
      utorid: "utorid",
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

  describe "POST /instructors/" do
    context "when expected" do
      it "create new instructor" do
        name = 'firstname lastname'
        post :create, params: {utorid: 'poop', name: name, email: 'firstname.lastname@cs.toronto.edu'}
        expect(response.status).to eq(200)
        json = {message: "Instructor #{name} has been created.'"}.to_json
        expect(response.body).to eq(json)
      end
    end

    context "{utorid} already exists" do
      it "throws status 404" do
        post :create, params: {utorid: instructor[:utorid], name: 'firstname lastname', email: 'firstname.lastname@cs.toronto.edu'}
        expect(response.status).to eq(404)
        json = {message: "This instructor already exists."}.to_json
        expect(response.body).to eq(json)
      end
    end

    context "{name} is nil" do
      it "throws status 404" do
        post :create, params: {utorid: instructor[:id], email: 'firstname.lastname@cs.toronto.edu'}
        expect(response.status).to eq(404)
        json = {message: "Missing either name or email."}.to_json
        expect(response.body).to eq(json)
      end
    end

    context "{email} is nil" do
      it "throws status 404" do
        post :create, params: {utorid: instructor[:id], name: 'firstname lastname'}
        expect(response.status).to eq(404)
        json = {message: "Missing either name or email."}.to_json
        expect(response.body).to eq(json)
      end
    end

    context "{utorid} is nil" do
      it "throws status 404" do
        post :create, params: {name: 'firstname lastname', email: 'firstname.lastname@cs.toronto.edu'}
        expect(response.status).to eq(404)
        json = {message: "No utorid given."}.to_json
        expect(response.body).to eq(json)
      end
    end
  end

  describe "PUT /instructors/{id}" do
    context "when expected" do
      it "update instructor" do
        new_info = {
          name: 'firstname lastname',
          email: 'firstname.lastname@cs.toronto.edu'
        }
        patch :update, params: {id: instructor[:id], name: new_info[:name], email: new_info[:email]}
        expect(response.status).to eq(200)
        json = {message: "Instructor #{new_info[:name]}'s data has been updated.'"}.to_json
        expect(response.body).to eq(json)
        instructor.reload
        expect(instructor[:name]).to eq(new_info[:name])
        expect(instructor[:email]).to eq(new_info[:email])
      end
    end

    context "{name} is nil" do
      it "throws status 404" do
        patch :update, params: {id: instructor[:id], email: 'firstname.lastname@cs.toronto.edu'}
        expect(response.status).to eq(404)
        json = {message: "Missing either name or email."}.to_json
        expect(response.body).to eq(json)
      end
    end

    context "{email} is nil" do
      it "throws status 404" do
        patch :update, params: {id: instructor[:id], name: 'firstname lastname'}
        expect(response.status).to eq(404)
        json = {message: "Missing either name or email."}.to_json
        expect(response.body).to eq(json)
      end
    end

    context "No instructor with {id}" do
      it "throws status 404" do
        id = 'poop'
        patch :update, params: {id: id, name: 'firstname lastname', email: 'firstname.lastname@cs.toronto.edu'}
        expect(response.status).to eq(404)
        json = {message: "No instructor with id #{id} exists in the system."}.to_json
        expect(response.body).to eq(json)
      end
    end
  end

  describe "DELETE /instructors/{id}" do
    context "when expected" do
      it "deletes the instructor" do
        id = instructor[:id]
        delete :destroy, params: {id: id}
        expect(response.status).to eq(200)
        json = {message: "Instructor #{id} has been deleted."}.to_json
        expect{instructor.reload}.to raise_exception(ActiveRecord::RecordNotFound)
      end
    end

    context "when {id} is invalid" do
      it "throws status 404" do
        id = 'poop'
        delete :destroy, params: {id: id}
        expect(response.status).to eq(404)
        json = {message: "No instructor with id #{id} exists in the system."}.to_json
      end
    end
  end


end
