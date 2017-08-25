require 'rails_helper'

describe ChassExporter do
  let (:exporter) { ChassExporter.new }
  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
      start_date: "2017-09-01 00:00:00 UTC",
      end_date: "2017-12-31 00:00:00 UTC",
    )
  end
  let(:position) do
    Position.create!(
    position: "CSC411 - test 2",
    round_id: "110",
    open: true,
    campus_code: 1,
    course_name: "Introduction to Software Testing",
    current_enrollment: 50,
    duties: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
    qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
    hours: 22,
    estimated_count: 15,
    estimated_total_hours: 330,
    session_id: session.id,
    cap_enrollment: nil,
    num_waitlisted: nil,
    )
  end

  before(:each) do
    @applicant = Applicant.create!(
      utorid: "cookie222",
      app_id: "1",
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

  context "when round_id is invalid" do
    subject { exporter.export(1) }
    it "return generated false and an error message" do
      expect(subject).to eq({generated: false, msg: "Error: Invalid round_id"})
    end
  end

  context "when round_id is valid" do
    context "and there are no assignments" do
      subject { exporter.export(position[:round_id]) }

      it "returns generated false and an error message" do
        expect(subject).to eq ({generated: false,
          msg: "Warning: You have not made any assignments. Operation aborted."})
      end
    end

    context "and there are assignments" do
      before(:each) do
        @assignment= @applicant.assignments.create!(
            position_id: position.id,
            hours: 50
        )
        @data= [{
          app_id: @applicant[:app_id],
          course_id: position[:position],
          hours: @assignment[:hours],
          round_id: position[:round_id].to_s,
          utorid: @applicant[:utorid],
          name: "#{@applicant[:first_name]} #{@applicant[:last_name]}"
        }]
      end
      subject { exporter.export(position[:round_id]) }

      it "returns generated true and data of all assignments in :round_id" do
        expect(subject).to eq ({generated: true, data: JSON.pretty_generate(@data),
          type: "application/json", file: "offers_#{position[:round_id]}.json"})
      end
    end

  end

end
