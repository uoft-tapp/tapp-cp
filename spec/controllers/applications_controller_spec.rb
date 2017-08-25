require 'rails_helper'

RSpec.describe ApplicationsController, type: :controller do
  let(:parsed_body) { JSON.parse(response.body) }

  let(:applicant) do
    Applicant.create!(
    utorid: "cookie222",
    app_id: "-111",
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

  let(:application) do
    applicant.applications.create!(
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

  describe "GET #index" do
    context "when not passed an applicant ID" do
      it "list applications" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when passed an applicant ID" do
      it "list applications given an integer applicant ID " do
        get :index, params: { applicant_id: application.applicant.id }, format: :json
        expect(response.status).to eq(200)
        expect(parsed_body).to be_kind_of(Array)
        expect(parsed_body).not_to be_empty
        expect(parsed_body.first).to include(application.attributes.except("created_at", "updated_at"))
      end

      it "list applications given a non-integer applicant ID" do
        get :index, params: { applicant_id: "poop" }
        expect(response.status).to eq(404)
      end
    end
  end

  describe "GET #SHOW" do
    context "when not passed an applicant ID" do
      it "given an integer ID, returns an application" do
        get :show, params: { id: application.id }
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include("preferences", application.attributes.except("created_at", "updated_at"))
      end

      it "given a non-integer ID, returns 404" do
        get :show, params: { id: "poops" }
        expect(response.status).to eq(404)
      end
    end
  end
end
