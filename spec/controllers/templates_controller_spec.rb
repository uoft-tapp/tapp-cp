require 'rails_helper'

RSpec.describe TemplatesController, type: :controller do

  let(:instructor1) do
    Instructor.create!(
      utorid: "utorid1",
      name: "instructor1 name",
      email: "email1@example.com"
    )
  end

  let(:instructor2) do
    Instructor.create!(
      utorid: "utorid2",
      name: "instructor2 name",
      email: "email2@example.com"
    )
  end

  let(:template) do
    Template.create!(
      name: "template name",
      instructor_id: instructor1[:id]
    )
  end

  before(:each) do
    template.reload
  end

  describe "GET /templates/" do
    context "when expected" do
      it "lists all templates" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /templates/{id} exists" do
      it "lists templates with {id}" do
        get :show, params: {id: template[:id]}
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

  describe "GET /instructors/:utorid/templates" do
    context "/:id" do
      context "when :utorid is valid" do
        context "when :id is valid" do
          it "returns a json of the template" do
            get :show, params: {utorid: instructor1[:utorid], id: template[:id]}
            expect(response.status).to eq(200)
            expect(response.body).not_to be_empty
          end
        end
        context "when :id is invalid" do
          it "throws status 404" do
            get :show, params: {utorid: instructor1[:utorid], id: "poop"}
            expect(response.status).to eq(404)
          end
        end
      end

      context "when :utorid is invalid" do
        it "throws status 404" do
          get :show, params: {utorid: "poop", id: template[:id]}
          expect(response.status).to eq(404)
        end
      end
    end

    context "when utorid is valid" do
      context "when :utorid of an instructor with templates is used" do
        it "lists all templates for instructor of utorid" do
          get :index, params: {utorid: instructor1[:utorid]}
          expect(response.status).to eq(200)
          expect(response.body).not_to eq([].to_json)
        end
      end

      context "when :utorid of an instructor with no templates is used" do
        it "returns an empty array" do
          get :index, params: {utorid: instructor2[:utorid]}
          expect(response.status).to eq(200)
          expect(response.body).to eq([].to_json)
        end
      end
    end

    context "when :utorid is invalid" do
      it "returns an empty array" do
        get :index, params: {utorid: "poop"}
        expect(response.status).to eq(200)
        expect(response.body).to eq([].to_json)
      end
    end
  end

  describe "POST /instructors/:utorid/templates" do
    context "when :utorid is valid" do
      context "when :name for template doen't exist for the instructor" do
        it "creates a new template" do
          get :create, params: {utorid: instructor1[:utorid], name: "new template"}
          expect(response.status).to eq(201)
          new_template = Template.find_by(name: "new template")
          expect(template).not_to eq(nil)
        end
      end
      context "when :name for template already exists for the instructor" do
        it "throws status 404 with error message" do
          get :create, params: {utorid: instructor1[:utorid], name: template[:name]}
          expect(response.status).to eq(404)
          message = {message: "Error: A template with the same name already exists."}
          expect(response.body).to eq(message.to_json)
        end
      end
    end

    context "when :utorid is invalid" do
      it "throws status 404" do
        get :create, params: {utorid: "poop"}
        expect(response.status).to eq(404)
      end
    end
  end

  describe "PATCH /instructors/:utorid/templates/:id" do
    context "when :utorid is valid" do
      context "when :id is valid" do
        before(:each) do
          template_data = template.format
          expect(template_data[:allocations]).to eq([])
          expect(template_data[:trainings]).to eq([])
          expect(template_data[:categories]).to eq([])
          expect(template_data[:scaling_learning]).to eq(false)
        end
        it "updates the template" do
          update_data = {
            utorid: instructor1[:utorid],
            id: template[:id],
            allocations: [
          		{
          			num_unit: 2,
          			unit_name: "test string",
          			minutes: 30,
                duty_id: 1,
        		},
          		{
          			num_unit: 2,
          			unit_name: "test string2",
          			minutes: 30,
                duty_id: 2,
          		}
          	],
          	trainings: [1],
          	categories: [2],
          	scaling_learning: true
          }
          patch :update, params: update_data
          template.reload
          Allocation.all.each do |allocation|
            allocation.reload
          end
          template_data = template.format
          allocations = []
          template_data[:allocations].each do |allocation|
            data = {
                num_unit: allocation[:num_unit],
                unit_name: allocation[:unit_name],
                minutes: allocation[:minutes],
            }
            if allocation[:duty_id]
              data[:duty_id] = allocation[:duty_id]
            end
            allocations.push(data)
          end
          expect(allocations).to eq(update_data[:allocations])
          expect(template_data[:trainings]).to eq(update_data[:trainings])
          expect(template_data[:categories]).to eq(update_data[:categories])
          expect(template_data[:scaling_learning]).to eq(update_data[:scaling_learning])
        end
      end
      context "when :id is invalid" do
        it "throws a 404 error" do
          patch :update, params: {utorid: instructor1[:utorid], id: "poop"}
          expect(response.status).to eq(404)
        end
      end
    end

    context "when :utorid is invalid" do
      it "throws a 403 error" do
        patch :update, params: {utorid: "poop", id: template[:id]}
        expect(response.status).to eq(403)
      end
    end
  end

  describe "DELETE /templates/:id" do
    context "when :id is valid" do
      it "deletes the template with :id" do
        delete :destroy, params: {id: template[:id]}
        templates = Template.all
        expect(templates).to be_empty
      end
    end
    context "when :id is invalid" do
      it "throws a 404 error" do
        delete :destroy, params: {id: "poop"}
        expect(response.status).to eq(404)
      end
    end
  end

  describe "DELETE /instructors/:utorid/templates/:id" do
    context "when :utorid is valid" do
      context "when :id is valid" do
        it "deletes the template with :id" do
          delete :destroy, params: {utorid: instructor1[:utorid], id: template[:id]}
          templates = Template.all
          expect(templates).to be_empty
        end
      end
      context "when :id is invalid" do
        it "throws a 404 error" do
          delete :destroy, params: {utorid: instructor1[:utorid], id: "poop"}
          expect(response.status).to eq(404)
        end
      end
    end
    context "when :utorid is invalid" do
      it "throws a 403 error" do
        delete :destroy, params: {utorid: "poop", id: template[:id]}
        expect(response.status).to eq(403)
      end
    end
  end

  describe "GET /templates/:template_id/preview" do
    context "when :template_id is valid" do
      it "sends a pdf file" do
        get :preview, params: {template_id: template[:id]}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"ddah_template.pdf\"")
      end
    end
    context "when :template_id is invalid" do
      it "throws a 404 error" do
        get :preview, params: {template_id: "poop"}
        expect(response.status).to eq(404)
      end
    end
  end
end
