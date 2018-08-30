require 'rails_helper'

RSpec.describe OffersController, type: :controller do
  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
    )
  end

  let(:instructor) do
    Instructor.create!(
      utorid: "poops",
      name: "poops lastname",
      email: "poops@example.com"
    )
  end

  let(:position) do
    Position.create!(
      position: "CSC104H1S",
      round_id: 110,
      open: true,
      campus_code: 1,
      course_name: "Computational Thinking",
      current_enrolment: nil,
      duties: "TA duties may include marking, leading skills development tutorials, Q&A/Exam/Assignment/Test Review sessions, and laboratories where noted.",
      qualifications: "Must be enrolled in, or have completed, an undergraduate program in computer science or education (or equivalent). Demonstrated excellent English communication skills. Patience teaching technical concepts to students with a wide variety of non-technical backgrounds. Must have completed or be in the process of completing a course involving functional programming. Must be able to write code in the Intermediate Student Language of Racket, and trace it in the same manner as the Intermediate Student Language Stepper of the DrRacket development environment.",
      hours: 54,
      estimated_count: 17,
      estimated_total_hours: 918,
      session_id: session.id,
      start_date: "2017-09-01 00:00:00 UTC",
      end_date: "2017-12-31 00:00:00 UTC",
    )
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
    app_id: "19",
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
    app_id: "21",
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
    app_id: "22",
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
        ddah_status: "Pending",
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
        ddah_status: "Accepted",
        hr_status: "Printed",
        send_date: DateTime.now,
        link: "mangled-link",
    )
  end
  let(:processed_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_4[:id],
        hours: 60,
        status: "Accepted",
        hr_status: "Processed",
        ddah_status: "Approved",
        send_date: DateTime.now,
        link: "mangled-link",
    )
  end
  let(:created_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_5[:id],
        hours: 60,
        status: "Rejected",
        ddah_status: "Created",
        hr_status: "Printed",
        send_date: DateTime.now,
        link: "mangled-link",
    )
  end
  let(:ready_offer) do
    Offer.create!(
        position_id: position[:id],
        applicant_id: applicant_6[:id],
        hours: 60,
        status: "Withdrawn",
        ddah_status: "Ready",
        hr_status: "Printed",
        send_date: DateTime.now,
        link: "mangled-link",
    )
  end

  describe "GET /offers/" do
    context "when expected" do
      it "lists all offers" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /offers/{id} exists" do
      it "lists offers with {id}" do
        get :show, params: {id: offer[:id]}
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

  describe "POST /offers/" do
    context ":offer_id/can-send-contract" do
      context "when all offers are valid" do
        it "returns a status 204" do
          post :can_send_contract, params: {offers: [offer[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "when not all offers are valid" do
        it "returns a status 404 and a json containing invalid offer_id's" do
          post :can_send_contract, params: {offers: [offer[:id], accepted_offer[:id]]}
          expect(response.status).to eq(404)
          json = {invalid_offers: [accepted_offer[:id]]}.to_json
          expect(response.body).to eq(json)
        end
      end
    end

    context "send-contracts" do
      before(:each) do
        expect(offer[:status]).to eq("Unsent")
      end
      it "returns a message of whether the contract has been sent" do
        post :send_contracts, params: {offers: [offer[:id]]}
        offer.reload
        expect(response.status).to eq(200)
        expect(response.body).to eq({
          message: "You've successfully sent out all the contracts."
        }.to_json)
        expect(offer[:status]).to eq("Pending")
      end
    end

    context ":offer_id/can-nag" do
      context "when all offers are valid" do
        it "returns a status 204" do
          post :can_nag, params: {offers: [sent_offer[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "when not all offers are valid" do
        it "returns a status 400 and a json containing invalid offer_id's" do
          post :can_nag, params: {offers: [offer[:id], sent_offer[:id]]}
          expect(response.status).to eq(404)
          json = {invalid_offers: [offer[:id]]}.to_json
          expect(response.body).to eq(json)
        end
      end
    end


    context "nag" do
      context "when offer is Pending" do
        before(:each) do
          expect(sent_offer[:nag_count]).to eq(0)
        end
        it "return a message of the number of time a applicant has been nagged at" do
          post :batch_email_nags, params: {offers: [sent_offer[:id]]}
          sent_offer.reload
          expect(response.status).to eq(200)
          res = ({ message: "You've sent the nag emails."}).to_json
          expect(response.body).to eq(res)
          expect(sent_offer[:nag_count]).to eq(1)
        end
      end
    end

    context ":offer_id/decision/:status" do
      context "when offer_id doesn't exists" do
        it "returns a status 404" do
          post :set_status, params: {offer_id: "poop", status: "accept"}
          expect(response.status).to eq(404)
        end
      end
      context "when offer_id does exists" do
        context "when status is pending" do
          context "code = accept" do
            it "updates the offer status to Accepted" do
              post :set_status, params: {offer_id: sent_offer[:id], status: "accept"}
              expect(response.status).to eq(200)
              body = {success: true, status: "accepted", message: "You've just accepted this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = reject" do
            it "updates the offer status to Rejected" do
              post :set_status, params: {offer_id: sent_offer[:id], status: "reject"}
              expect(response.status).to eq(200)
              body = {success: true, status: "rejected", message: "You've just rejected this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = withdraw" do
            it "updates the offer status to Withdrawn" do
              post :set_status, params: {offer_id: sent_offer[:id], status: "withdraw"}
              expect(response.status).to eq(200)
              body = {success: true, status: "withdrawn", message: "You've just withdrawn this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end
        end

        context "when status is Unsent" do
          context "code = accept" do
            it "returns a status 404 with a message" do
              post :set_status, params: {offer_id: offer[:id], status: "accept"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot accept an unsent offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = reject" do
            it "updates the offer status to Rejected" do
              post :set_status, params: {offer_id: offer[:id], status: "reject"}
              expect(response.status).to eq(404)
              body = {success: false, message: "You cannot reject an unsent offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = withdraw" do
            it "updates the offer status to Withdrawn" do
              post :set_status, params: {offer_id: offer[:id], status: "withdraw"}
              expect(response.status).to eq(200)
              offer.reload
              expect(offer[:status]).to eq("Withdrawn")
            end
          end
        end

        context "when status decided" do
          context "code = accept" do
            it "returns a status 404 with a message" do
              post :set_status, params: {offer_id: accepted_offer[:id], status: "accept"}
              expect(response.status).to eq(200)
              body = {success: true, status: "accepted", message: "You've just accepted this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = reject" do
            it "updates the offer status to Rejected" do
              post :set_status, params: {offer_id: accepted_offer[:id], status: "reject"}
              expect(response.status).to eq(200)
              body = {success: true, status: "rejected", message: "You've just rejected this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end

          context "code = withdraw" do
            it "updates the offer status to Withdrawn" do
              post :set_status, params: {offer_id: accepted_offer[:id], status: "withdraw"}
              expect(response.status).to eq(200)
              body = {success: true, status: "withdrawn", message: "You've just withdrawn this offer."}
              expect(response.body).to eq(body.to_json)
            end
          end
        end
      end

    end
    context ":offer_id/can-print" do
      context "when all offers are valid" do
        it "returns a status 204" do
          post :can_print, params: {offers: [accepted_offer[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "when not all offers are valid" do
        it "returns a status 400 and a json containing invalid offer_id's" do
          post :can_print, params: {offers: [offer[:id], accepted_offer[:id]]}
          expect(response.status).to eq(404)
          json = {invalid_offers: [offer[:id]]}.to_json
          expect(response.body).to eq(json)
        end
      end
    end

    context "print with update" do
      it "sends a PDF blob" do
        post :combine_contracts_print, params: {offers: [offer[:id]], update: true}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"contracts.pdf\"")
        offer.reload
        expect(offer[:hr_status]).to eq("Printed")
      end
    end

    context "print without update" do
      it "sends a PDF blob" do
        post :combine_contracts_print, params: {offers: [offer[:id]]}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"contracts.pdf\"")
        offer.reload
        expect(offer[:hr_status]).to eq(nil)
      end
    end


    context ":offer_id/can-hr-update" do
      context "when all offers are valid" do
        it "returns a status 204" do
          post :can_hr_update, params: {offers: [accepted_offer[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "when not all offers are valid" do
        it "returns a status 400 and a json containing invalid offer_id's" do
          post :can_hr_update, params: {offers: [offer[:id], accepted_offer[:id]]}
          expect(response.status).to eq(404)
          json = {invalid_offers: [offer[:id]]}.to_json
          expect(response.body).to eq(json)
        end
      end
    end

    context ":offer_id/can-ddah-update" do
      context "when all offers are valid" do
        it "returns a status 204" do
          post :can_ddah_update, params: {offers: [accepted_offer[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "when not all offers are valid" do
        it "returns a status 400 and a json containing invalid offer_id's" do
          post :can_ddah_update, params: {offers: [offer[:id], accepted_offer[:id]]}
          expect(response.status).to eq(404)
          json = {invalid_offers: [offer[:id]]}.to_json
          expect(response.body).to eq(json)
        end
      end
    end


  end

  describe "PATCH /offers/:id" do
    before(:each) do
      expect(offer[:hr_status]).to eq(nil)
      expect(offer[:ddah_status]).to eq("None")
    end
    it "returns status 204 and updates offer" do
      patch :update, params: {id: offer[:id], hr_status: "printed", ddah_status: "accepted"}
      offer.reload
      expect(response.status).to eq(204)
      expect(offer[:hr_status]).to eq("printed")
      expect(offer[:ddah_status]).to eq("accepted")
    end
  end

  describe "PATCH /offers/batch-update" do
    before(:each) do
      expect(offer[:hr_status]).to eq(nil)
      expect(offer[:ddah_status]).to eq("None")
    end
    it "returns status 204 and updates offer" do
      patch :update, params: {id: "batch-update", offers: [offer[:id]], hr_status: "printed", ddah_status: "accepted"}
      offer.reload
      expect(response.status).to eq(204)
      expect(offer[:hr_status]).to eq("printed")
      expect(offer[:ddah_status]).to eq("accepted")
    end
    it "returns status 404 when there is no offers" do
      patch :update, params: {id: "batch-update", hr_status: "printed", ddah_status: "accepted"}
      offer.reload
      expect(response.status).to eq(404)
    end
  end

  describe "GET pb/:offer_id/pdf" do
    context "when :offer_id is valid" do
      it "returns status 200 a pdf" do
        get :get_contract_student, params: {offer_id: offer[:id]}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"contract.pdf\"")
      end
    end

    context "when :offer_id is invalid" do
      it "returns status 404 and an error message" do
        get :get_contract_student, params: {offer_id: "poops"}
        expect(response.status).to eq(404)
      end
    end
  end

  describe "POST pb/:offer_id/:status" do
    context "when offer_id does exists" do
      context "when status is pending" do
        context "code = accept" do
          it "updates the offer status to Accepted" do
            post :set_status_student, params: {offer_id: sent_offer[:id], status: "accept"}
            expect(response.status).to eq(200)
            body = {success: true, status: "accepted", message: "You've just accepted this offer."}
            expect(response.body).to eq(body.to_json)
          end
        end

        context "code = reject" do
          it "updates the offer status to Rejected" do
            post :set_status_student, params: {offer_id: sent_offer[:id], status: "reject"}
            expect(response.status).to eq(200)
            body = {success: true, status: "rejected", message: "You've just rejected this offer."}
            expect(response.body).to eq(body.to_json)
          end
        end

        context "code = withdraw" do
          it "updates the offer status to Withdrawn" do
            post :set_status_student, params: {offer_id: sent_offer[:id], status: "withdraw"}
            expect(response.status).to eq(404)
            body = {success: false, message: "Error: no permission to set such status"}
            expect(response.body).to eq(body.to_json)
          end
        end
      end

      context "when status is Unsent" do
        context "code = accept" do
          it "returns a status 404 with a message" do
            post :set_status_student, params: {offer_id: offer[:id], status: "accept"}
            expect(response.status).to eq(404)
            body = {success: false, message: "You cannot accept an unsent offer."}
            expect(response.body).to eq(body.to_json)
          end
        end

        context "code = reject" do
          it "updates the offer status to Rejected" do
            post :set_status_student, params: {offer_id: offer[:id], status: "reject"}
            expect(response.status).to eq(404)
            body = {success: false, message: "You cannot reject an unsent offer."}
            expect(response.body).to eq(body.to_json)
          end
        end

        context "code = withdraw" do
          it "updates the offer status to Withdrawn" do
            post :set_status_student, params: {offer_id: offer[:id], status: "withdraw"}
            expect(response.status).to eq(404)
            body = {success: false, message: "Error: no permission to set such status"}
            expect(response.body).to eq(body.to_json)
          end
        end
      end

      context "when status decided" do
        context "code = accept" do
          it "returns a status 404 with a message" do
            post :set_status_student, params: {offer_id: accepted_offer[:id], status: "accept"}
            expect(response.status).to eq(200)
            body = {success: true, status: "accepted", message: "You've just accepted this offer."}
            expect(response.body).to eq(body.to_json)
          end
        end

        context "code = reject" do
          it "updates the offer status to Rejected" do
            post :set_status_student, params: {offer_id: accepted_offer[:id], status: "reject"}
            expect(response.status).to eq(200)
            body = {success: true, status: "rejected", message: "You've just rejected this offer."}
            expect(response.body).to eq(body.to_json)
          end
        end

        context "code = withdraw" do
          it "updates the offer status to Withdrawn" do
            post :set_status_student, params: {offer_id: accepted_offer[:id], status: "withdraw"}
            expect(response.status).to eq(404)
            body = {success: false, message: "Error: no permission to set such status"}
            expect(response.body).to eq(body.to_json)
          end
        end
      end
    end

  end

  describe "POST /offers/can-clear-hris-status" do
    context "hris status = nil" do
      it "it throws a status 404 error" do
        post :can_clear_hris_status, params: {offers: [sent_offer[:id]]}
        expect(response.status).to eq(404)
        body = {invalid_offers: [sent_offer[:id]]}
        expect(response.body).to eq(body.to_json)
      end
    end
    context "hris status = Printed" do
      it "it passes with a status 204" do
        post :can_clear_hris_status, params: {offers: [accepted_offer[:id]]}
        expect(response.status).to eq(204)
      end
    end
    context "hris status = Processed" do
      it "it passes with a status 204" do
        post :can_clear_hris_status, params: {offers: [processed_offer[:id]]}
        expect(response.status).to eq(204)
      end
    end
  end

  describe "/offers/clear-hris-status" do
    context "when hris status = Printed" do
      it "returns a status 204" do
        post :clear_hris_status, params: {offers: [accepted_offer[:id]]}
        expect(response.status).to eq(204)
        accepted_offer.reload
        expect(accepted_offer[:hr_status]).to eq(nil)
        expect(accepted_offer[:print_time]).to eq(nil)
      end
    end
    context "when hris status = Processed" do
      it "returns a status 204" do
        post :clear_hris_status, params: {offers: [processed_offer[:id]]}
        expect(response.status).to eq(204)
        processed_offer.reload
        expect(processed_offer[:hr_status]).to eq(nil)
        expect(processed_offer[:print_time]).to eq(nil)
      end
    end
  end

  describe "POST /offers/can-nag-instructor" do
    context "when position has instructor" do
      before(:each) do
        position.instructor_ids = [instructor[:id]]
      end
      context "when ddah_status = None" do
        it "throws a 204 status" do
          post :can_nag_instructor, params: {offers: [offer[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "when ddah_status = Created" do
        it "throws a 204 status" do
          post :can_nag_instructor, params: {offers: [created_offer[:id]]}
          expect(response.status).to eq(204)
        end
      end
      context "when ddah_status = Ready" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [ready_offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [ready_offer[:id]]}
          expect(response.body).to eq(body.to_json)
        end
      end
      context "when ddah_status = Pending" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [sent_offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [sent_offer[:id]]}
          expect(response.body).to eq(body.to_json)
      end
      end
      context "when ddah_status = Accepted" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [processed_offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [processed_offer[:id]]}
          expect(response.body).to eq(body.to_json)
        end
      end
    end
    context "when position has no instructor" do
      context "when ddah_status = None" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [offer[:id]]}
          expect(response.body).to eq(body.to_json)
        end
      end
      context "when ddah_status = Created" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [created_offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [created_offer[:id]]}
          expect(response.body).to eq(body.to_json)
        end
      end
      context "when ddah_status = Ready" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [ready_offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [ready_offer[:id]]}
          expect(response.body).to eq(body.to_json)
        end
      end
      context "when ddah_status = Pending" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [sent_offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [sent_offer[:id]]}
          expect(response.body).to eq(body.to_json)
      end
      end
      context "when ddah_status = Accepted" do
        it "throws a 404 error" do
          post :can_nag_instructor, params: {offers: [processed_offer[:id]]}
          expect(response.status).to eq(404)
          body = {invalid_offers: [processed_offer[:id]]}
          expect(response.body).to eq(body.to_json)
        end
      end
    end
  end

  describe "POST /offers/send-nag-instructor" do
    context "when ddah_status = Ready" do
      it "throws a 200 status" do
        post :send_nag_instructor, params: {offers: [ready_offer[:id]]}
        expect(response.status).to eq(200)
        body = {message: "You've successfully sent out all the nag emails."}
        expect(response.body).to eq(body.to_json)
      end
    end
    context "when ddah_status = Pending" do
      it "throws a 200 status" do
        post :send_nag_instructor, params: {offers: [sent_offer[:id]]}
        expect(response.status).to eq(200)
        body = {message: "You've successfully sent out all the nag emails."}
        expect(response.body).to eq(body.to_json)
    end
    end
    context "when ddah_status = Accepted" do
      it "throws a 200 status" do
        post :send_nag_instructor, params: {offers: [processed_offer[:id]]}
        expect(response.status).to eq(200)
        body = {message: "You've successfully sent out all the nag emails."}
        expect(response.body).to eq(body.to_json)
      end
    end
  end

  describe "GET /offers/:offer_id/pdf" do
    context "when :offer_id is valid" do
      it "returns status 200 a pdf" do
        get :get_contract, params: {offer_id: offer[:id]}
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("application/pdf")
        expect(response.header["Content-Disposition"]).to eq(
          "inline; filename=\"contract.pdf\"")
      end
    end

    context "when :offer_id is invalid" do
      it "returns status 404 and an error message" do
        get :get_contract, params: {offer_id: "poops"}
        expect(response.status).to eq(404)
      end
    end
  end
  describe "POST /offers/:offer_id/accept" do
    context "when offer status = Unsent" do
      it "return a status 404 error" do
        post :accept_offer, params: {offer_id: offer[:id]}
        expect(response.status).to eq(404)
        body = {message: "Error: You can't accept an Unsent offer."}
        expect(response.body).to eq(body.to_json)
      end
    end
    context "when offer status = Pending" do
      it "return a status 200" do
        post :accept_offer, params: {offer_id: sent_offer[:id]}
        expect(response.status).to eq(200)
        offer = sent_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Accepted'."}
        sent_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(sent_offer[:status]).to eq("Accepted")
      end
    end
    context "when offer status = Accepted" do
      it "return a status 200" do
        post :accept_offer, params: {offer_id: accepted_offer[:id]}
        expect(response.status).to eq(200)
        offer = accepted_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Accepted'."}
        accepted_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(accepted_offer[:status]).to eq("Accepted")
      end
    end
    context "when offer status = Rejected" do
      it "return a status 200" do
        post :accept_offer, params: {offer_id: created_offer[:id]}
        expect(response.status).to eq(200)
        offer = created_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Accepted'."}
        created_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(created_offer[:status]).to eq("Accepted")
      end
    end
    context "when offer status = Withdrawn" do
      it "return a status 200" do
        post :accept_offer, params: {offer_id: ready_offer[:id]}
        expect(response.status).to eq(200)
        offer = ready_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Accepted'."}
        ready_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(ready_offer[:status]).to eq("Accepted")
      end
    end
  end

  describe "POST /offers/:offer_id/reset" do
    context "when offer status = Unsent" do
      it "return a status 404 error" do
        post :reset_offer, params: {offer_id: offer[:id]}
        expect(response.status).to eq(200)
        offer.reload
        expect(offer[:status]).to eq('Unsent')
        temp = offer.format
        body = {message: "You've changed the status of #{temp[:applicant][:first_name]} #{temp[:applicant][:last_name]}'s offer for #{temp[:position]} to 'Unsent'."}
        expect(response.body).to eq(body.to_json)
      end
    end
    context "when offer status = Pending" do
      it "return a status 200" do
        post :reset_offer, params: {offer_id: sent_offer[:id]}
        expect(response.status).to eq(200)
        offer = sent_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Unsent'."}
        sent_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(sent_offer[:status]).to eq('Unsent')
      end
    end
    context "when offer status = Accepted" do
      it "return a status 200" do
        post :reset_offer, params: {offer_id: accepted_offer[:id]}
        expect(response.status).to eq(200)
        offer = accepted_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Unsent'."}
        accepted_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(accepted_offer[:status]).to eq('Unsent')
      end
    end
    context "when offer status = Rejected" do
      it "return a status 200" do
        post :reset_offer, params: {offer_id: created_offer[:id]}
        expect(response.status).to eq(200)
        offer = created_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Unsent'."}
        created_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(created_offer[:status]).to eq('Unsent')
      end
    end
    context "when offer status = Withdrawn" do
      it "return a status 200" do
        post :reset_offer, params: {offer_id: ready_offer[:id]}
        expect(response.status).to eq(200)
        offer = ready_offer.format
        body = {message: "You've changed the status of #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s offer for #{offer[:position]} to 'Unsent'."}
        ready_offer.reload
        expect(response.body).to eq(body.to_json)
        expect(ready_offer[:status]).to eq('Unsent')
      end
    end
  end
end
