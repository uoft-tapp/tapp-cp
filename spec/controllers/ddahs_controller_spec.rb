require 'rails_helper'

RSpec.describe DdahsController, type: :controller do

  def get_allocations(alloc)
    allocations = []
    alloc.each do |allocation|
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
    return allocations
  end

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
  let(:applicant_5) do
    Applicant.create!(
    utorid: "cookie225",
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
  let(:applicant_6) do
    Applicant.create!(
    utorid: "cookie226",
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

  let(:applicant_7) do
    Applicant.create!(
    utorid: "cookie227",
    app_id: "17",
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

  let(:offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_7[:id],
        hours: 60,
        link: "mangled-link",
        ddah_status: "None",
    )
  end
  let(:attached_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_1[:id],
        hours: 60,
        link: "mangled-link",
        ddah_status: "Created",
    )
  end
  let(:ready_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_5[:id],
        hours: 60,
        status: "Pending",
        send_date: DateTime.now,
        link: "mangled-link",
        ddah_status: "Ready",
    )
  end
  let(:approved_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_6[:id],
        hours: 60,
        status: "Pending",
        send_date: DateTime.now,
        link: "mangled-link",
        ddah_status: "Approved",
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
        ddah_status: "Pending",
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
        ddah_status: "Accepted",
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

  let(:ready_ddah) do
    Ddah.create!(
      offer_id: ready_offer[:id],
      instructor_id: instructor3[:id],
      optional: true,
    )
  end

  let(:approved_ddah) do
    Ddah.create!(
      offer_id: approved_offer[:id],
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

  let(:template) do
    Template.create!(
      name: 'template',
      optional: ddah[:optional],
      instructor_id: ddah[:instructor_id],
      tutorial_category: ddah[:tutorial_category],
      department: ddah[:department],
      scaling_learning: ddah[:scaling_learning],
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

  describe "data[:duty_" do
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
          expect(ddah.training_ids).to eq(update_data[:trainings])
          expect(ddah.category_ids).to eq(update_data[:categories])
          expect(ddah[:scaling_learning]).to eq(update_data[:scaling_learning])
          ddah.allocations.reload
          expect(get_allocations(ddah.allocations)).to eq(update_data[:allocations])
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

  describe "can actions" do
    describe "POST /ddahs/can-preview" do
      context "contains status = None/nil" do
        it "throws status 404 with invalid ddahs" do
          post :can_preview, params: {ddahs: ["poop"]}
          expect(response.status).to eq(404)
          message = {invalid_offers: ["poop"]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Created" do
        it "throws status 204" do
          post :can_preview, params: {ddahs: [ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Ready" do
        it "throws status 204" do
          post :can_preview, params: {ddahs: [ready_ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Approved" do
        it "throws status 204" do
          post :can_preview, params: {ddahs: [approved_ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Pending" do
        it "throws status 204" do
          post :can_preview, params: {ddahs: [sent_ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Accepted" do
        it "throws status 204" do
          post :can_preview, params: {ddahs: [accepted_ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
    end

    describe "POST /ddahs/can-send-ddah" do
      context "contains status = None/nil" do
        it "throws status 404 with invalid ddahs" do
          post :can_send_ddahs, params: {ddahs: ["poop"]}
          expect(response.status).to eq(404)
          message = {invalid_offers: ["poop"]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Created" do
        it "throws status 404 with invalid ddahs" do
          post :can_send_ddahs, params: {ddahs: [ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Ready" do
        it "throws status 404 with invalid ddahs" do
          post :can_send_ddahs, params: {ddahs: [ready_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [ready_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Approved" do
        it "throws status 204" do
          post :can_send_ddahs, params: {ddahs: [approved_ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Pending" do
        it "throws status 204" do
          post :can_send_ddahs, params: {ddahs: [sent_ddah[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "contains status = Accepted" do
        it "throws status 404 with invalid ddahs" do
          post :can_send_ddahs, params: {ddahs: [accepted_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [accepted_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
    end

    describe "POST /ddahs/can-nag-student" do
      context "contains status = None/nil" do
        it "throws status 404 with invalid ddahs" do
          post :can_nag_student, params: {ddahs: ["poop"]}
          expect(response.status).to eq(404)
          message = {invalid_offers: ["poop"]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Created" do
        it "throws status 404 with invalid ddahs" do
          post :can_nag_student, params: {ddahs: [ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Ready" do
        it "throws status 404 with invalid ddahs" do
          post :can_nag_student, params: {ddahs: [ready_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [ready_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Approved" do
        it "throws status 404 with invalid ddahs" do
          post :can_nag_student, params: {ddahs: [approved_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [approved_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Pending" do
        it "throws status 204" do
          post :can_nag_student, params: {ddahs: [sent_ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Accepted" do
        it "throws status 404 with invalid ddahs" do
          post :can_nag_student, params: {ddahs: [accepted_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [accepted_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
    end

    describe "POST /ddahs/status/can-finish" do
      context "contains status = None/nil" do
        it "throws status 404 with invalid ddahs" do
          post :can_finish_ddah, params: {ddahs: ["poop"]}
          expect(response.status).to eq(404)
          message = {invalid_offers: ["poop"]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Created" do
        it "throws status 204" do
          post :can_finish_ddah, params: {ddahs: [ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Ready" do
        it "throws status 404 with invalid ddahs" do
          post :can_finish_ddah, params: {ddahs: [ready_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [ready_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Approved" do
        it "throws status 404 with invalid ddahs" do
          post :can_finish_ddah, params: {ddahs: [approved_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [approved_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Pending" do
        it "throws status 404 with invalid ddahs" do
          post :can_finish_ddah, params: {ddahs: [sent_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [sent_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Accepted" do
        it "throws status 404 with invalid ddahs" do
          post :can_finish_ddah, params: {ddahs: [accepted_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [accepted_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end

    end

    describe "/ddahs/status/can-approve" do
      context "contains status = None/nil" do
        it "throws status 404 with invalid ddahs" do
          post :can_approve_ddah, params: {ddahs: ["poop"]}
          expect(response.status).to eq(404)
          message = {invalid_offers: ["poop"]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Created" do
        it "throws status 404 with invalid ddahs" do
          post :can_approve_ddah, params: {ddahs: [ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Ready" do
        it "throws status 204" do
          post :can_approve_ddah, params: {ddahs: [ready_ddah[:id]]}
          expect(response.status).to eq (204)
        end
      end
      context "contains status = Approved" do
        it "throws status 404 with invalid ddahs" do
          post :can_approve_ddah, params: {ddahs: [approved_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [approved_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Pending" do
        it "throws status 404 with invalid ddahs" do
          post :can_approve_ddah, params: {ddahs: [sent_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [sent_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
      context "contains status = Accepted" do
        it "throws status 404 with invalid ddahs" do
          post :can_approve_ddah, params: {ddahs: [accepted_ddah[:id]]}
          expect(response.status).to eq(404)
          message = {invalid_offers: [accepted_ddah[:id]]}
          expect(response.body).to eq(message.to_json)
        end
      end
    end
  end

  describe "batch actions" do
    describe "POST /ddahs/preview" do
      it "returns a PDF file" do
        post :preview, params: {ddahs: [ddah[:id]]}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"ddahs.pdf\"")
      end
    end
    describe "POST /ddahs/send-ddahs" do
      it "sends out the ddahs" do
        post :send_ddahs, params: {ddahs: [approved_ddah[:id], sent_ddah[:id]]}
        expect(response.status).to eq(200)
        message = {message: "You've successfully sent out all the DDAH's."}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "POST /ddahs/send-nag-student" do
      it "sends out the nag emails" do
        post :send_nag_student, params: {ddahs: [sent_ddah[:id]]}
        expect(response.status).to eq(200)
        message = {message: "You've sent the nag emails."}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "POST /ddahs/status/finish" do
      it "sets the ddah status to ready" do
        signature='poop'
        post :finish_ddah, params: {ddahs: [ddah[:id]], signature: signature}
        expect(response.status).to eq(200)
        message = {message: "The selected DDAH's have been signed and set to status 'Ready'."}
        expect(response.body).to eq(message.to_json)
        ddah.reload
        expect(Offer.find(ddah[:offer_id])[:ddah_status]).to eq("Ready")
        expect(ddah[:supervisor_signature]).to eq(signature)
      end
    end
    describe "POST /ddahs/status/approve" do
      it "sets the ddah status to approved" do
        signature='poop'
        post :approve_ddah, params: {ddahs: [ready_ddah[:id]], signature: signature}
        expect(response.status).to eq(200)
        message = {message: "The selected DDAH's have been signed and set to status 'Approved'."}
        expect(response.body).to eq(message.to_json)
        ready_ddah.reload
        expect(Offer.find(ready_ddah[:offer_id])[:ddah_status]).to eq("Approved")
        expect(ready_ddah[:ta_coord_signature]).to eq(signature)
      end
    end
  end

  describe "POST /ddahs/:ddah_id/new-template" do
    describe "when expected" do
      it "returns a status 200" do
        post :new_template, params: {ddah_id: ddah[:id], name: 'poops'}
        expect(response.status).to eq(200)
        message = {message: "A new template was successfully created."}
        expect(response.body).to eq(message.to_json)
        template = Template.find_by(name: 'poops')
        expect(template).not_to eq(nil)
        expect(template[:optional]).to eq(ddah[:optional])
        expect(template[:instructor_id]).to eq(ddah[:instructor_id])
        expect(template[:tutorial_category]).to eq(ddah[:tutorial_category])
        expect(template[:department]).to eq(ddah[:department])
        expect(template[:scaling_learning]).to eq(ddah[:scaling_learning])
        expect(template.training_ids).to eq(ddah.training_ids)
        expect(template.category_ids).to eq(ddah.category_ids)
        expect(template.allocations.length).to eq(ddah.allocations.length)
        expect(get_allocations(template.allocations)).to eq(get_allocations(ddah.allocations))
      end
    end
    describe "when template with the same name already exists" do
      it "throws a status 404 error" do
        post :new_template, params: {ddah_id: ddah[:id], name: template[:name]}
        expect(response.status).to eq(404)
        message = {message: "A template with the same name already exists."}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "when ddah {id} is invalid" do
      it "throws a status 404 error" do
        post :new_template, params: {ddah_id: 'poops', name: 'poops'}
        expect(response.status).to eq(404)
        message = {message: "Invalid or no id given."}
        expect(response.body).to eq(message.to_json)
      end
    end
  end

  describe "GET /ddahs/:ddah_id/pdf" do
    describe "when expected" do
      it "returns a status 200" do
        post :pdf, params: {ddah_id: ddah[:id]}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"ddah.pdf\"")
      end
    end
    describe "when ddah {id} is invalid" do
      it "throws a status 404 error" do
        post :pdf, params: {ddah_id: 'poops'}
        expect(response.status).to eq(404)
        message = {message: "A DDAH has not been made for this offer."}
        expect(response.body).to eq(message.to_json)
      end
    end
  end

  describe "POST /ddahs/:ddah_id/accept" do
    describe "when expected" do
      it "returns a status 200" do
        post :accept, params: {ddah_id: ddah[:id]}
        expect(response.status).to eq(200)
        message = {message: "You have accepted this DDAH.", status: "Accepted"}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "when ddah is already Accepted" do
      it "throws a status 404 error" do
        post :accept, params: {ddah_id: accepted_ddah[:id]}
        expect(response.status).to eq(404)
        message = {message: "You have already accepted this DDAH.", status: "Accepted"}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "when ddah {id} is invalid" do
      it "throws a status 404 error" do
        post :accept, params: {ddah_id: 'poops'}
        expect(response.status).to eq(404)
        message = {message: "A DDAH has not been made for this offer."}
        expect(response.body).to eq(message.to_json)
      end
    end
  end

  describe "POST /pb/ddah/:offer_id/accept" do
    describe "when expected" do
      it "returns a status 200" do
        signature = 'poops'
        post :student_accept, params: {offer_id: sent_offer[:id], signature: signature}
        expect(response.status).to eq(200)
        message = {message: "You have accepted this DDAH.", status: "Accepted"}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "when ddah is unsent" do
      it "throws a status 404 error" do
        signature = 'poops'
        post :student_accept, params: {offer_id: attached_offer[:id], signature: signature}
        expect(response.status).to eq(404)
        message = {message: "You cannot accept an unsent DDAH.", status: 'Created'}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "when offer doesn't have a ddah" do
      it "throws a status 404 error" do
        signature = 'poops'
        post :student_accept, params: {offer_id: offer[:id], signature: signature}
        expect(response.status).to eq(404)
        message = {message: "DDAH does not exist."}
        expect(response.body).to eq(message.to_json)
      end
    end
    describe "when offer {id} is invalid" do
      it "throws a status 404 error" do
        signature = 'poops'
        post :student_accept, params: {offer_id: signature, signature: signature}
        expect(response.status).to eq(404)
        message = {message: "Offer does not exist."}
        expect(response.body).to eq(message.to_json)
      end
    end
  end

  describe "GET /pb/ddah/:offer_id/pdf" do
    describe "when expected" do
      it "returns a status 200" do
        post :student_pdf, params: {offer_id: attached_offer[:id]}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"ddah.pdf\"")
      end
    end
    describe "when ddah {id} is invalid" do
      it "throws a status 404 error" do
        post :student_pdf, params: {offer_id: 'poops'}
        expect(response.status).to eq(404)
        message = {message: "A DDAH has not been made for this offer."}
        expect(response.body).to eq(message.to_json)
      end
    end
  end

end
