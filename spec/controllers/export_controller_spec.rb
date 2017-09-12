require 'rails_helper'

RSpec.describe ExportController, type: :controller do
  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
    )
  end

  let(:position) do
    Position.create!(
    position: "CSC411 - test 3",
    round_id: "110",
    open: true,
    campus_code: 1,
    course_name: "Introduction to Software Testing",
    current_enrolment: 50,
    duties: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
    qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
    hours: 22,
    estimated_count: 15,
    estimated_total_hours: 330,
    session_id: session.id,
    cap_enrolment: nil,
    num_waitlisted: nil,
    start_date: "2017-09-01 00:00:00 UTC",
    end_date: "2017-12-31 00:00:00 UTC",
    )
  end

  context "when there are no applicants in the system" do
    context "when calling #transcript_access" do
      it "returns status 404 and an error message" do
        get :transcript_access
        message = {message:
          "Warning: There are currenly no applicant in the system. Operation aborted"}
        expect(response.status).to eq(404)
        expect(response.body).to eq(message.to_json)
      end
    end
  end

  context "when there are applicants in the system" do
    before(:each) do
      @applicant = Applicant.create!(
        utorid: "cookie222",
        app_id: "14",
      student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        dept: "Computer Science",
        program_id: "4UG",
        yip: 4,
        email: "simps@mail.com",
        phone: "4165558888",
        address: "100 Jameson Ave Toronto, ON M65-48H"
      )
      @application = @applicant.applications.create!(
        round_id: "110",
        ta_training: "N",
        access_acad_history: "Y",
        ta_experience: "CSC373H1S (2), CSC318H1S (5), CSC423H5S (4), CSC324H1S (9), CSC404H1S (8)",
        academic_qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        technical_skills: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        availability: "MW 9-8, RF 12-7",
        other_info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        special_needs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor."
        )
    end

    context "when calling #transcript_access" do
      it "returns status 200 and downloads transcript_access.csv" do
        get :transcript_access
        expect(response.status).to eq(200)
        expect(response.content_type).to eq("text/csv")
        expect(response.header["Content-Disposition"]).to eq(
          "attachment; filename=\"transcript_access.csv\"")
      end
    end

    context "when there are no assignments in the system" do
      context "when calling #chass" do
        context "when round_id is valid" do
          it "returns status 404 and an error message" do
            get :chass, params: {round_id: position[:round_id]}
            message = {message:
              "Warning: You have not made any assignments. Operation aborted."}
            expect(response.status).to eq(404)
            expect(response.body).to eq(message.to_json)
          end

        end

      end

      context "when calling #cdf" do
        it "returns status 404 and an error message" do
          get :cdf
          expect(response.status).to eq(404)
          message = {message:
            "Warning: You have not made any assignments. Operation aborted."}
          expect(response.status).to eq(404)
          expect(response.body).to eq(message.to_json)
        end

      end

      context "when calling #offers" do
        it "returns status 404 and an error message" do
          get :offers
          expect(response.status).to eq(404)
          message = {message:
            "Warning: You have not made any assignments. Operation aborted."}
          expect(response.status).to eq(404)
          expect(response.body).to eq(message.to_json)
        end
      end
    end

    context "when there are assignments in the system" do
      before(:each) do
        @applicant.assignments.create!(
          position_id: position.id,
          hours: 50
        )
      end
      context "when calling #chass" do
        context "when round_id is invalid" do
          it "returns status 404 and an error message" do
            get :chass, params: {round_id: 1}
            message = {message: "Error: Invalid round_id"}
            expect(response.status).to eq(404)
            expect(response.body).to eq(message.to_json)
          end

        end

        context "when round_id is valid" do
          it "returns status 200 and downloads offers_(round_id).json" do
            get :chass, params: {round_id: position[:round_id]}
            expect(response.status).to eq(200)
            expect(response.content_type).to eq("application/json")
            expect(response.header["Content-Disposition"]).to eq(
              "attachment; filename=\"offers_110.json\"")
          end

        end

      end

      context "when calling #cdf" do
        it "returns status 200 and downloads cdf_info.csv" do
          get :cdf
          expect(response.status).to eq(200)
          expect(response.content_type).to eq("text/csv")
          expect(response.header["Content-Disposition"]).to eq(
            "attachment; filename=\"cdf_info.csv\"")
        end

      end

      context "when calling #offers" do
        it "returns status 200 and downloads offers.csv" do
          get :offers
          expect(response.status).to eq(200)
          expect(response.content_type).to eq("text/csv")
          expect(response.header["Content-Disposition"]).to eq(
            "attachment; filename=\"offers.csv\"")
        end
      end
    end
  end

end
