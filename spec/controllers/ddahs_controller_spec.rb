require 'rails_helper'

RSpec.describe DdahsController, type: :controller do

  let(:session) do
    session = Session.create!(
        semester: "Fall",
        year: 2017,
      )
  end

  let(:instructor3) do
    instructor3 = Instructor.create!(
        utorid: "utorid3",
        name: "instructor3 name",
        email: "email3@example.com"
      )
  end

  let(:instructor4) do
    Instructor.create!(
      utorid: "utorid4",
      name: "instructor4 name",
      email: "email4@example.com"
    )
  end

  let(:position) do
    position = Position.create!(
        position: "CSC104H1S",
        round_id: 122,
        open: true,
        campus_code: 1,
        course_name: "Computational Thinking",
        current_enrolment: nil,
        duties: "TA duties may include marking, leading skills development tutorials, Q&A/Exam/Assignment/Test Review sessions, and laboratories where noted.",
        qualifications: "Must be enrolled in, or have completed, an undergraduate program in computer science or education (or equivalent). Demonstrated excellent English communication skills. Patience teaching technical concepts to students with a wide variety of non-technical backgrounds. Must have completed or be in the process of completing a course involving functional programming. Must be able to write code in the Intermediate Student Language of Racket, and trace it in the same manner as the Intermediate Student Language Stepper of the DrRacket development environment.",
        hours: 54,
        estimated_count: 17,
        estimated_total_hours: 918,
        session_id: session[:id],
        start_date: "2017-09-01 00:00:00 UTC",
        end_date: "2017-12-31 00:00:00 UTC",
      )
    position.instructor_ids = [instructor3[:id]]
    return position
  end

  let(:applicant_1) do
    Applicant.create!(
    utorid: "cookie222",
    app_id: "11",
    student_number: 1234567890,
    first_name: "Landy",
    last_name: "Simpson",
    dept: "Computer Science",
    program_id: "4UG",
    yip: 4,
    email: "simps@mail.com",
    phone: "4165558888",
    address: "100 Jameson Ave Toronto, ON M65-48H")
  end

  let(:applicant_2) do
    Applicant.create!(
    utorid: "cookie223",
    app_id: "14",
    student_number: 1234567890,
    first_name: "Landy",
    last_name: "Simpson",
    dept: "Computer Science",
    program_id: "4UG",
    yip: 4,
    email: "simps@mail.com",
    phone: "4165558888",
    address: "100 Jameson Ave Toronto, ON M65-48H")
  end

  let(:applicant_3) do
    Applicant.create!(
    utorid: "cookie221",
    app_id: "16",
    student_number: 1234567890,
    first_name: "Landy",
    last_name: "Simpson",
    dept: "Computer Science",
    program_id: "4UG",
    yip: 4,
    email: "simps@mail.com",
    phone: "4165558888",
    address: "100 Jameson Ave Toronto, ON M65-48H")
  end

  let(:applicant_4) do
    Applicant.create!(
    utorid: "cookie224",
    app_id: "16",
    student_number: 1234567890,
    first_name: "Landy",
    last_name: "Simpson",
    dept: "Computer Science",
    program_id: "4UG",
    yip: 4,
    email: "simps@mail.com",
    phone: "4165558888",
    address: "100 Jameson Ave Toronto, ON M65-48H")
  end

  let(:attached_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_1[:id],
        hours: 60,
        link: "mangled-link",
    )
  end
  let(:sent_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_2[:id],
        hours: 60,
        status: "Pending",
        send_date: DateTime.now,
        link: "mangled-link",
    )
  end
  let(:accepted_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_3[:id],
        hours: 60,
        status: "Accepted",
        send_date: DateTime.now,
        link: "mangled-link",
    )
  end
  let(:unattached_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_4[:id],
        hours: 60,
        link: "mangled-link",
    )
  end

  let(:ddah) do
    Ddah.create!(
      offer_id: attached_offer[:id],
      instructor_id: instructor3[:id],
      optional: true,
    )
  end

  let(:sent_ddah) do
    Ddah.create!(
      offer_id: sent_offer[:id],
      instructor_id: instructor3[:id],
      optional: true,
    )
  end

  let(:accepted_ddah) do
    Ddah.create!(
      offer_id: accepted_offer[:id],
      instructor_id: instructor3[:id],
      optional: true,
    )
  end

  before(:each) do
    ddah.reload
    sent_ddah.reload
    accepted_ddah.reload
  end

  describe "GET /ddahs/" do
    context "when expected" do
      it "lists all ddahs" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /ddahs/{id} exists" do
      it "lists ddahs with {id}" do
        get :show, params: {id: ddah[:id]}
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

  describe "GET /instructors/:utorid/ddahs" do
    context "/:id" do
      context "when :utorid is valid" do
        context "when :id is valid" do
          it "returns a json of the ddah" do
            get :show, params: {utorid: instructor3[:utorid], id: ddah[:id]}
            expect(response.status).to eq(200)
            expect(response.body).not_to eq([].to_json)
          end
        end
        context "when :id is invalid" do
          it "throws status 404" do
            get :show, params: {utorid: instructor3[:utorid], id: "poop"}
            expect(response.status).to eq(404)
          end
        end
      end

      context "when :utorid is invalid" do
        it "throws status 404" do
          get :show, params: {utorid: "poop", id: ddah[:id]}
          expect(response.status).to eq(404)
        end
      end
    end

    context "when utorid is valid" do
      context "when :utorid of an instructor with ddahs is used" do
        it "lists all ddahs for instructor of utorid" do
          get :index, params: {utorid: instructor3[:utorid]}
          expect(response.status).to eq(200)
          expect(response.body).not_to eq([].to_json)
        end
      end

      context "when :utorid of an instructor with no ddahs is used" do
        it "returns an empty array" do
          get :index, params: {utorid: instructor4[:utorid]}
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

  describe "POST /instructors/:utorid/ddahs" do
    context "when :utorid is valid" do
      before(:each) do
        expect(unattached_offer[:ddah_status]).to eq("None")
      end
      it "creates a new ddah" do
        get :create, params: {utorid: instructor3[:utorid], offer_id: unattached_offer[:id]}
        unattached_offer.reload
        expect(response.status).to eq(201)
        expect(unattached_offer[:ddah_status]).to eq("Created")
        ddah = Ddah.find_by(offer_id: unattached_offer[:id])
        expect(ddah).not_to eq(nil)
      end
    end

    context "when :utorid is invalid" do
      it "throws status 404" do
        get :create, params: {utorid: "poop"}
        expect(response.status).to eq(404)
      end
    end
  end

  describe "PATCH /instructors/:utorid/ddahs/:id" do
    context "when :utorid is valid" do
      context "when :id is valid" do
        before(:each) do
          ddah_data = ddah.format
          expect(ddah_data[:allocations]).to eq([])
          expect(ddah_data[:trainings]).to eq([])
          expect(ddah_data[:categories]).to eq([])
          expect(ddah_data[:scaling_learning]).to eq(false)
        end
        it "updates the ddah" do
          update_data = {
            utorid: instructor3[:utorid],
            id: ddah[:id],
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
          ddah.reload
          ddah_data = ddah.format
          allocations = []
          ddah_data[:allocations].each do |allocation|
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
          expect(ddah_data[:trainings]).to eq(update_data[:trainings])
          expect(ddah_data[:categories]).to eq(update_data[:categories])
          expect(ddah_data[:scaling_learning]).to eq(update_data[:scaling_learning])
        end
      end
      context "when :id is invalid" do
        it "throws a 404 error" do
          patch :update, params: {utorid: instructor3[:utorid], id: "poop"}
          expect(response.status).to eq(404)
        end
      end
    end

    context "when :utorid is invalid" do
      it "throws a 403 error" do
        patch :update, params: {utorid: "poop", id: ddah[:id]}
        expect(response.status).to eq(403)
      end
    end
  end

  describe "DELETE /ddahs/:id" do
    context "when :id is valid" do
      it "deletes the ddah with :id" do
        delete :destroy, params: {id: ddah[:id]}
        ddahs = Ddah.all
        expect(Ddah.all.count).to eq(2)
      end
    end
    context "when :id is invalid" do
      it "throws a 404 error" do
        delete :destroy, params: {id: "poop"}
        expect(response.status).to eq(404)
      end
    end
  end

  describe "DELETE /instructors/:utorid/ddahs/:id" do
    context "when :utorid is valid" do
      context "when :id is valid" do
        it "deletes the ddah with :id" do
          delete :destroy, params: {utorid: instructor3[:utorid], id: ddah[:id]}
          expect(Ddah.all.count).to eq(2)
        end
      end
      context "when :id is invalid" do
        it "throws a 404 error" do
          delete :destroy, params: {utorid: instructor3[:utorid], id: "poop"}
          expect(response.status).to eq(404)
        end
      end
    end
    context "when :utorid is invalid" do
      it "throws a 403 error" do
        delete :destroy, params: {utorid: "poop", id: ddah[:id]}
        expect(response.status).to eq(403)
      end
    end
  end

end
