require 'rails_helper'

RSpec.describe AssignmentsController, type: :controller do
  let (:parsed_body) { JSON.parse(response.body) }
  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
    )
  end

  describe "GET #index" do
    before(:each) do
      @position = Position.create!(
        position: "CSC411 - Head TA",
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

      @applicant = Applicant.create!(
        utorid: "rocky145",
        app_id: "-111",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        email: "simps@mail.com",
        phone: "416-555-8888",
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

      @assignment = @applicant.assignments.create!(
        position_id: @position.id,
        hours: 50
        )
    end

    context "when not passed an applicant ID" do
      it "lists assignments" do
        get :index
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
      end
    end

    context "when passed an applicant ID" do
      it "returns the list of assignments given an integer applicant ID" do
        get :index, params: { applicant_id: @applicant.id }, format: :json
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body.first).to include(@assignment.attributes.except("created_at", "updated_at"))
      end

      it "returns 404 given a non-integer applicant ID" do
        get :index, params: { applicant_id: "poop" }, format: :json
        expect(response.status).to eq(404)
      end
    end
  end

  describe "GET #show" do
    before(:each) do
      @position = Position.create!(
        position: "CSC411 - Head TA",
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
        )

      @applicant = Applicant.create!(
        utorid: "rocky145",
        app_id: "-111",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        email: "simps@mail.com",
        phone: "416-555-8888",
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

      @assignment = @applicant.assignments.create!(
        position_id: @position.id,
        hours: 50
        )
    end

    context "when passed an integer ID" do
      it "returns the assignment" do
        get :show, params: { id: @assignment.id }
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include(@assignment.attributes.except("created_at", "updated_at"))
      end

      it "returns the assignment for the given applicant_id" do
        get :show, params: { applicant_id: @applicant.id, id: @assignment.id }
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include(@assignment.attributes.except("created_at", "updated_at"))
      end
    end

    context "when passed a non-integer ID" do
      it "returns 404" do
        get :show, params: { id: "poop" }
        expect(response.status).to eq(404)
      end

      it "returns 404, given an applicant ID" do
        get :show, params: { applicant_id: @applicant.id, id: "poop" }
        expect(response.status).to eq(404)
      end
    end
  end

  describe "POST #create" do
    before(:each) do
      @closed = Position.create!(
        position: "CSC108 - Head TA",
        round_id: "110",
        open: false,
        campus_code: 1,
        course_name: "Introduction to Programming Languages",
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

      @position = Position.create!(
        position: "CSC411 - Head TA",
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
        )

      @applicant = Applicant.create!(
        utorid: "rocky145",
        app_id: "-111",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        dept: "Computer Science",
        program_id: "4UG",
        yip: 4,
        email: "simps@mail.com",
        phone: "416-555-8888",
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

    context "when position is open" do
      context "& passed an applicant ID and position ID," do
        it "given a non-integer applicant ID and non-integer position ID" do
           post :create, params: { applicant_id: "poops", position_id: "poops", hours: 40 }
           expect(response.status).to eq(404) # 404 because of the .find query
        end

        it "given an integer applicant ID and non-integer position ID" do
          post :create, params: { applicant_id: @applicant.id, position_id: "poops", hours: 40 }
          expect(response.status).to eq(422)
        end

        it "given a non-integer applicant ID and integer position ID" do
          post :create, params: { applicant_id: "poops", position_id: @position.id, hours: 40 }
          expect(response.status).to eq(404) # 404 because of the .find query
        end

        it "given an integer applicant ID and integer position ID" do
          post :create, params: { applicant_id: @applicant.id, position_id: @position.id, hours: 40 }
          expect(response.status).to eq(200)
          expect(parsed_body).to include(@applicant.assignments.first.attributes.except("created_at", "updated_at"))
        end
      end

      context "& passed a number of hours," do
        it "given a non-integer hours parameter" do
          post :create, params: { applicant_id: @applicant.id, position_id: @position.id, hours: "poops" }
          expect(response.status).to eq(422)
        end
      end
    end
  end

  describe "PATCH #update" do
    before(:each) do
      @position = Position.create!(
        position: "CSC411 - Head TA",
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

      @applicant = Applicant.create!(
        utorid: "rocky145",
        app_id: "-111",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        dept: "Computer Science",
        program_id: "4UG",
        yip: 4,
        email: "simps@mail.com",
        phone: "416-555-8888",
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

      @assignment = @applicant.assignments.create!(
        position_id: @position.id,
        hours: 50
        )
    end

    context "when hours is an integer parameter" do
      it "update the assignment" do
        patch :update, params: { applicant_id: @applicant.id, id: @assignment.id, hours: 90}
        expect(response.status).to eq(200)
        expect(parsed_body["applicant_id"]).to eq(@applicant.id)
        expect(parsed_body["id"]).to eq(@assignment.id)
        expect(parsed_body["hours"]).to eq(90)
      end
    end

    context "when hours is a non integer parameter" do
        it "returns a 422 status" do
        patch :update, params: { applicant_id: @applicant.id, id: @assignment.id, hours: "poops"}
        expect(response.status).to eq(422)
      end
    end

    context "when export_date is valid" do
      it "updates the assignment" do
        patch :update, params: { applicant_id: @applicant.id, id: @assignment.id, export_date: "2017-08-08T15:25:03.000-04:00"}
        expect(response.status).to eq(200)
        expect(parsed_body["applicant_id"]).to eq(@applicant.id)
        expect(parsed_body["id"]).to eq(@assignment.id)
        expect(parsed_body["export_date"]).to eq("2017-08-08T15:25:03.000-04:00")
      end
    end

    context "when export_date is not valid" do
      it "it does not update the assignment" do
        patch :update, params: { applicant_id: @applicant.id, id: @assignment.id, export_date: "poops"}
        expect(parsed_body["export_date"]).to eq(nil)
        expect(response.status).to eq(200)
      end
    end

  end


  describe "DELETE #destroy" do
    before(:each) do
      @position = Position.create!(
        position: "CSC411 - Head TA",
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

      @applicant = Applicant.create!(
        utorid: "rocky145",
        app_id: "-111",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        dept: "Computer Science",
        program_id: "4UG",
        yip: 4,
        email: "simps@mail.com",
        phone: "416-555-8888",
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

      @assignment = @applicant.assignments.create!(
        position_id: @position.id,
        hours: 50
        )
    end

    it "throws 404 when passed an invalid applicant_id" do
      delete :destroy, params: { applicant_id: "poops", id: @assignment.id }
      expect(response.status).to eq(404)
    end

    it "throws 404 when passed an invalid assignment ID"  do
      delete :destroy, params: { applicant_id: @applicant.id, id: "poops" }
      expect(response.status).to eq(404)
    end

    it "deletes the assignment between position and applicant" do
      delete :destroy, params: { applicant_id: @applicant.id, id: @assignment.id }
      expect(response.status).to eq(204)

      assignments = Assignment.all
      expect(assignments).to be_empty
    end
  end
end
