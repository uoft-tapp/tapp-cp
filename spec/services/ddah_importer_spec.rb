require 'rails_helper'
require 'csv'

describe DdahImporter do

  def test_import(file)
    data = File.read("#{Rails.root}/spec/support/ddah_data/#{file}.csv")
    importer = DdahImporter.new
    return importer.import_ddahs(data)
  end

  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
    )
  end

  let(:position) do
    Position.create!(
      position: "CSC300",
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

  let(:instructor) do
    Instructor.create!(
      utorid: 'zaleskim',
      email: "test@example.com",
      name: 'firstName LastName',
    )
  end

  let(:applicant) do
    Applicant.create!(
    utorid: "amatunil",
    app_id: "11",
    student_number: 1234567890,
    first_name: "Levon",
    last_name: "Amatuni",
    dept: "Computer Science",
    program_id: "4UG",
    yip: 4,
    email: "simps@mail.com",
    phone: "4165558888",
    address: "100 Jameson Ave Toronto, ON M65-48H")
  end

  let(:applicant_2) do
    Applicant.create!(
    utorid: "applicant_2",
    app_id: "11",
    student_number: 1234567890,
    first_name: "Applicant",
    last_name: "2",
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
        applicant_id: applicant[:id],
        hours: 60,
        link: "mangled-link",
    )
  end

  before(:each) do
    position.instructor_ids = [instructor[:id]]
    applicant.reload
    offer.reload
  end

  context "when expected format" do
    context "when expected data" do
      it "updates the ddah and returns a success json" do
        result = test_import('default')
        expect(result).to eq({success: true, errors: false})
      end
    end
    context "when applicant doesn't exist" do
      it "returns a json with a list of exceptions" do
        result = test_import('nonexistent_applicant')
        expect(result).to eq({success: false, errors: true, message: ["Error: No such applicant as Non Existent"]})
      end
    end
    context "when offer doesn't exist" do
      it "returns a json with a list of exceptions" do
        result = test_import('nonexistent_offer')
        expect(result).to eq({success: false, errors: true, message: ["Error: No such applicant as Applicant 2"]})
      end
    end
  end

  context "when no instructor specified" do
    it "returns a json with a list of exceptions" do
      result = test_import('no_instructor')
      expect(result).to eq({success: false, errors: true, message: ["Error: No instructor specified. Operation Aborted."]})
    end
  end

  context "when no such position" do
    it "returns a json with a list of exceptions" do
      result = test_import('nonexistent_position')
      expect(result).to eq({success: false, errors: true, message: ["Error: No such position. Operation Aborted."]})
    end
  end

  context "when not a ddah csv" do
    context "when misaligned" do
      it "returns a json with a list of exceptions" do
        result = test_import('misaligned')
        expect(result).to eq({success: false, errors: true, message: ["Error: Not a DDAH CSV. Operation Aborted."]})
      end
    end
    context "when missing heading = supervisor_utorid" do
      it "returns a json with a list of exceptions" do
        result = test_import('no_supervisor_utorid')
        expect(result).to eq({success: false, errors: true, message: ["Error: Not a DDAH CSV. Operation Aborted."]})
      end
    end
    context "when missing heading = course_name" do
      it "returns a json with a list of exceptions" do
        result = test_import('no_course_name')
        expect(result).to eq({success: false, errors: true, message: ["Error: Not a DDAH CSV. Operation Aborted."]})
      end
    end
    context "when missing heading = round_id" do
      it "returns a json with a list of exceptions" do
        result = test_import('no_round_id')
        expect(result).to eq({success: false, errors: true, message: ["Error: Not a DDAH CSV. Operation Aborted."]})
      end
    end
    context "when missing heading = duties_list" do
      it "returns a json with a list of exceptions" do
        result = test_import('no_duties_list')
        expect(result).to eq({success: false, errors: true, message: ["Error: Not a DDAH CSV. Operation Aborted."]})
      end
    end
    context "when missing heading = trainings_list" do
      it "returns a json with a list of exceptions" do
        result = test_import('no_trainings_list')
        expect(result).to eq({success: false, errors: true, message: ["Error: Not a DDAH CSV. Operation Aborted."]})
      end
    end
    context "when missing heading = categories_list" do
      it "returns a json with a list of exceptions" do
        result = test_import('no_categories_list')
        expect(result).to eq({success: false, errors: true, message: ["Error: Not a DDAH CSV. Operation Aborted."]})
      end
    end
  end

end
