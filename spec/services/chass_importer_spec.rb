require 'rails_helper'

describe ChassImporter do
  let(:test_filename) { 'test/stub' }
  subject {
    data = JSON.parse(File.read("#{Rails.root}/db/#{test_filename}.json"))
    ChassImporter.new(data, "fall", 2017)
  }

  before :each do
    allow(File).to receive(:read).with(/#{test_filename}/).and_return(mock_json)
  end

  context "when used on an invalid file" do
    let(:mock_json) { '<?xml version="1.0" encoding="UTF-8"?>' }
    it "raises a descriptive error" do
      expect { subject }.to raise_error(JSON::ParserError)
    end
  end

  context "when parsing courses" do
    context "with a plain course" do
      let(:mock_json) { File.read("./spec/support/chass_data/plain_course.json") }

      before(:each) do
        # Sanity checking -- shouldn't ever fail
        expect(Position.all.count).to eq(0)
      end

      before(:each) { subject } # Evaluate subject

      it "inserts a course" do
        expect(Position.where(position: "CSC100H1S").count).to eq(1)
      end

      it "sets the campus code appropriately" do
        expect(Position.first.campus_code).to eq(1)
      end

      it "sets the course name appropriately" do
        expect(Position.first.course_name).to eq("First Year Office Hour TA")
      end

      it "sets the current enrolment correctly" do
        expect(Position.first.current_enrolment).to eq(100)
      end

      it "sets the position attributes correctly" do
        expect(Position.first.attributes.symbolize_keys).to include({
          qualifications: "Must be enrolled in or have completed a computer science degree, or equivalent. Must meet the qualifications to TA *ALL* of CSC 108, 148, and 165 (see CSC108H1-B, CSC148H1, CSC165H1 qualifications). Enthusiasm and patience for face-to-face teaching of beginners is required. Experience with CSC 104 or Racket preferred.",
          duties: "Hold office hours on a weekly basis to assist students taking 100-level CSC courses.",
          hours: 54,
          estimated_count: 5,
          estimated_total_hours: 270
          })
      end
    end


  context "when run on the same file twice" do
    let(:mock_json) { File.read("./spec/support/chass_data/plain_course.json") }

    it "keeps calm" do
      subject # Run first time
      expect {
        subject # Run the second time
      }.to_not raise_error
    end

    it "doesn't modify Position records" do
      subject
      expect {
        subject
      }.to_not change { Position.all.to_a }
    end
  end

  context "when importing applicants" do
    context "from a file with no applicants" do
      let (:mock_json) { File.read("./spec/support/chass_data/no_applicant.json") }
      it "does not raise any errors" do
        expect {subject}.to_not raise_error
      end
    end

    context "from a file with a non-UtorID applicant" do
      let (:mock_json) { File.read("./spec/support/chass_data/no_utorid_applicant.json") }
      it "raises ActiveRecord::NotNullViolation exception" do
        expect { subject }.to raise_error(ActiveRecord::NotNullViolation,
          /PG::NotNullViolation: ERROR:  null value in column "utorid" violate/)
      end
    end

    context "from an expected file" do
      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      before(:each) do

        # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "creates an applicant record" do
        expect(Applicant.where(utorid: "applicant478").count).to eq(1)
      end

      it "sets fields on the applicant record" do
        expect(Applicant.first.attributes.symbolize_keys).to include({
          utorid: "applicant478",
          app_id: "478",
          student_number: "1425362850",
          first_name: "Luklorizur",
          last_name: "Mrokarczur",
          dept: "Physics",
          program_id: "8UG",
          yip: 10,
          email: "luklorizur.mrokarczur@mail.utoronto.ca",
          phone: "6476879273",
          address: "478 Karczur St.",
          full_time: "Y"
        })

      end

      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      it "does not duplicate applicant records" do
        # IDEA: run the importer a second time, check number of applicants is the same
        expect(Applicant.where(utorid: "applicant478").count).to eq(1)
      end
    end
  end

  context "when importing applications" do
    context "from an expected file" do
      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      before(:each) do
        # Sanity checking -- shouldn't ever fail
        expect(Application.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "creates an applicant record" do
        applicant = Applicant.where(utorid: "applicant478").pluck(:id).first
        expect(Application.where({applicant_id: applicant}).count).to eq(1)
      end

      it "sets fields on the applicant record" do
        applicant = Applicant.where(utorid: "applicant478").pluck(:id).first
        expect(Application.first.attributes.symbolize_keys.as_json(:except => [:id, :created_at, :updated_at])).to include({
          applicant_id: applicant,
          ta_training: "N",
          access_acad_history: "N",
          round_id: "110",
          ta_experience: "CSC148H5S (9), CSC258H5S (5), CSC300H1S (3), CSC209H1S (2), CSC321H1S (1)",
          academic_qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
          technical_skills: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
          availability: "Available",
          other_info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
          special_needs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor."
      }.as_json)
      end

      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      it "does not duplicate application records" do
        # IDEA: run the importer a second time, check number of application is the same
        applicant = Applicant.where(utorid: "applicant478").pluck(:id).first
        expect(Application.where({applicant_id: applicant}).count).to eq(1)
      end
    end
  end

  context "when importing into Preference model" do
    context "from an expected file" do
      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      before(:each) do
          # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "updates the course positions specified in preferences from rank 2 to the described rank" do
        applicant = Applicant.where(utorid: "applicant478").take
        application ||= applicant.applications.take
        position_ident = {position: "CSC100H1S", round_id: 110}
        position_id = Position.where(position_ident).select(:id).take.id
        rank ||= application.preferences.select(:rank).take.rank
        expect(rank).to eq(1)
      end
    end

    context "from an expected file with several preferences" do
      let (:mock_json) { File.read("./spec/support/chass_data/applicant_two_prefs.json") }
      before(:each) do
          # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
        expect(Position.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "updates all preferred courses to rank 1" do
        applicant = Applicant.where(utorid: "applicant478").take
        application ||= applicant.applications.take
        application.preferences.each do |pref|
          if (pref[Position.find_by(position: "C4M101H1F")[:id]] and
            pref[Position.find_by(position: "C4M101H1F")[:id]])
            expect(pref[:rank]).to eq(1)
          elsif pref[Position.find_by(position: "CSC104H1S")[:id]]
            expect(pref[:rank]).to eq(2)
          end
        end
      end
    end

    context "from file with non-existent course positions in courses" do
      let (:mock_json) { File.read("./spec/support/chass_data/nonexistent_course_position_applicant.json") }
      before(:each) do

          # Sanity checking -- shouldn't ever fail
          expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "insert only the existent positions to Preference model" do
        applicant = Applicant.where(utorid: "applicant478").take
        application = applicant.applications.take
        preferences ||= application.preferences
        expect(preferences.count).to eq(1)
      end

    end

    context "from file with non-existent course positions in preferences" do
      let (:mock_json) { File.read("./spec/support/chass_data/nonexistent_course_position_applicant_pref.json") }
      before(:each) do

          # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "insert only the existent positions to Preference model" do
        applicant = Applicant.where(utorid: "applicant478").take
        application = applicant.applications.take
        preferences ||= application.preferences
        expect(preferences.count).to eq(1)
      end
    end
  end
end
  context "when checking status" do
    context "file with no round_id" do
      let(:mock_json) { File.read("./spec/support/chass_data/no_round.json") }
      it "returns error json" do
        error = {success: false, errors: true, message: ["Import Failure: no round_id found in the file"]}
        expect(subject.get_status).to eq(error)
      end
    end

    context "file with more than one round_id" do
      let(:mock_json) { File.read("./spec/support/chass_data/too_many_rounds.json") }
      it "returns error json" do
        error = {success: false, errors: true, message: ["Import Failure: too many round_ids found in the file"]}
        expect(subject.get_status).to eq(error)
      end
    end

    context "expected file" do
      let(:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      it "returns success json with imported true" do
        success = {success: true, errors: false, message: ["CHASS import completed."]}
        expect(subject.get_status).to eq(success)
      end
    end

    context "expected file with bad dates" do
      let(:mock_json) { File.read("./spec/support/chass_data/applicant_bad_dates.json") }
      it "returns errors json with imported true" do
        success = {success: true, errors: true, message: ["Error: The dates for Position CSC100H1S is malformed."]}
        expect(subject.get_status).to eq(success)
      end
    end

  end
end
