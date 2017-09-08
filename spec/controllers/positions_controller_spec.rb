require 'rails_helper'

RSpec.describe PositionsController, type: :controller do

  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
    )
  end

  let(:position) do
    Position.create!(
      position: "CSC104H1S",
      round_id: 110,
      open: true,
      campus_code: 1,
      course_name: "Computational Thinking",
      current_enrollment: nil,
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

  let(:instructor) do
    Instructor.create!(
      name: "instructor name",
      email: "example@email.com",
      utorid: "utorid",
    )
  end

  describe "GET /positions/" do
    context "when expected" do
      it "lists all positions" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /positions/{id} exists" do
      it "lists positions with {id}" do
        get :show, params: {id: position[:id]}
        expect(Position.all.count).to eq(1)
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when {id} is a non-existent id" do
      it "throws status 404" do
        get :show, params: {id: 5}
        expect(response.status).to eq(404)
      end
    end
  end

  describe "PATCH /positions/{id}" do
    context "when {id} is valid for Position" do
      before(:each) do
        @params = {
          id: position.id,
          position: position.position,
          round_id: 110,
          open: true,
          campus_code: 1,
          course_name: "Computational Thinking",
          current_enrollment: nil,
          duties: "simplified duties",
          qualifications: "qualifications",
          hours: 20,
          estimated_count: 15,
          estimated_total_hours: 300,
          instructors: [instructor.id],
          session_id: session.id,
          cap_enrollment: nil,
          num_waitlisted: nil,
          start_date: "2017-09-04 00:00:00.000000000-04:00",
          end_date: "2017-09-05 00:00:00.000000000-04:00",
        }
        expect(position.instructor_ids).to eq([])
        put :update, params: @params
      end

      it "updates position with {id}" do
        position.reload
        expect(position.as_json(:except => [:title, :created_at, :updated_at, :instructors]))
          .to eq(@params.as_json(:except => [:instructors]))
        expect(position.instructor_ids).to eq(@params[:instructors])
          expect(response.status).to eq(204)
      end
    end

    context "when {id} is not valid for Position" do
      before(:each) do
        @params = {
          id: 8,
          position: position.position,
          round_id: 110,
          open: true,
          campus_code: 1,
          course_name: "Computational Thinking",
          estimated_enrolment: nil,
          duties: "simplified duties",
          qualifications: "qualifications",
          hours: 20,
          estimated_count: 15,
          estimated_total_hours: 300,
          cap_enrollment: nil,
          num_waitlisted: nil,
        }
        put :update, params: @params
      end

      it "throws a status 404" do
        expect(response.status).to eq(404)
      end
    end

  end
end
