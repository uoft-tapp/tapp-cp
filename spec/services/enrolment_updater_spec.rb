require 'rails_helper'
describe EnrolmentUpdater do
  test_filename="temp"
  subject {
    data = File.read("#{Rails.root}/spec/support/enrolment_data/#{test_filename}.txt")
    updater = EnrolmentUpdater.new(data)
    return updater.get_status
  }

  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
    )
  end
  let(:position) do
    Position.create!(
    position: "CSC411 - test 2",
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
  failure = {success: false, errors: true, message: ["Error: This file is not formatted correctly."]}
  success = {success: true, errors: false}

  context "well-formatted data" do
    before :each do
      expect(position[:current_enrolment]).to eq(50)
      expect(position[:cap_enrolment]).to eq(nil)
      expect(position[:num_waitlisted]).to eq(nil)
    end
    it "return update true with message" do
      test_filename= "expected"
      expect(subject).to eq(success)
      position.reload
      expect(position[:current_enrolment]).to eq(196)
      expect(position[:cap_enrolment]).to eq(196)
      expect(position[:num_waitlisted]).to eq(150)
    end
  end

  context "badly-formatted data" do
    context "when file is too short" do
      it "return a update false with message" do
        test_filename= "short"
        expect(subject).to eq(failure)
      end
    end

    context "when there strings where numbers are suppose to be" do
      it "return a update false with message" do
        test_filename= "bad_string_position"
        expect(subject).to eq(failure)
      end
    end

    context "when there strings are not the right length" do
      it "return a update false with message" do
        test_filename= "bad_string_len"
        expect(subject).to eq(failure)
      end
    end

  end
end
