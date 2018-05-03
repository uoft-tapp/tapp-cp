require 'rails_helper'
require 'csv'

describe CSVGenerator do
  let (:generator) { CSVGenerator.new }
  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
    )
  end
  let(:position) do
    Position.create!(
    position: "CSC411 - test",
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
    session_id: session[:id],
    cap_enrolment: nil,
    num_waitlisted: nil,
    start_date: "2017-09-01 00:00:00 UTC",
    end_date: "2017-12-31 00:00:00 UTC",
    )
  end

  context "when generating cdf_info" do
    let(:applicant) do
      Applicant.create!(
      utorid: "cookie222",
      app_id: "15",
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
    context "when there are no assignments in the system" do
      subject { generator.generate_cdf_info(session[:id]) }
      it "return generated false and an error message" do
        expect(subject).to eq({generated: false,
          msg: "Warning: You have not made any assignments. Operation aborted."})
      end
    end

    context "when there are assignments in the system" do
      before(:each) do
        @assignment= applicant.assignments.create!(
            position_id: position[:id],
            hours: 50
        )
        @data = CSV.generate do |csv|
          csv << [
            "course_code",
            "email_address",
            "studentnumber",
            "familyname",
            "givenname",
            "student_department",
            "utorid",
          ]
          csv << [
            position[:position],
            applicant[:email],
            applicant[:student_number],
            applicant[:last_name],
            applicant[:first_name],
            applicant[:dept],
            applicant[:utorid]
          ]
        end
      end
      subject { generator.generate_cdf_info(session[:id]) }

      it "returns generated true and data of all cdf info" do
        expect(subject).to eq ({generated: true, data: @data, type: "text/csv",
          file: "cdf_info.csv"})
      end
    end
  end

  context "when generating offers" do
    let(:applicant) do
      Applicant.create!(
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

    context "when there are no assignments in the system" do
      subject { generator.generate_offers(session[:id]) }
      it "return generated false and an error message" do
        expect(subject).to eq({generated: false,
          msg: "Warning: You have not made any assignments. Operation aborted."})
      end
    end

    context "when there are assignments in the system" do
      before(:each) do
        @assignment= applicant.assignments.create!(
            position_id: position[:id],
            hours: 50
        )
        @data = CSV.generate do |csv|
          csv << [
            "course_code",
            "course_title",
            "offer_hours",
            "student_number",
            "familyname",
            "givenname",
            "student_status",
            "student_department",
            "email_address",
            "round_id",
          ]
          csv << [
            position[:position],
            position[:course_name],
            @assignment[:hours].to_s,
            applicant[:student_number].to_s,
            applicant[:last_name],
            applicant[:first_name],
            "Other",
            applicant[:dept],
            applicant[:email],
            position[:round_id].to_s,
          ]
        end
      end
      subject { generator.generate_offers(session[:id]) }

      it "returns generated true and data of all cdf info" do
        expect(subject).to eq ({generated: true, data: @data, type: "text/csv",
          file: "#{session[:semester]}_#{session[:year]}_Offers.csv"})
      end
    end
  end

  context "when generating transcript_access" do
    context "when there are no applicants in the system" do
      subject { generator.generate_transcript_access(session[:id]) }
      it "return generated false and an error message" do
        expect(subject).to eq({generated: false,
          msg: "Warning: There are currenly no applicant in the system. Operation aborted"})
      end
    end

    context "when there are applicants in the system" do
      before(:each) do
        @applicant= Applicant.create!(
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
        @application.preferences.create!(
            position_id: position[:id],
        )
        @data = CSV.generate do |csv|
          csv << [
            "student_number",
            "familyname",
            "givenname",
            "grant",
            "email_address"
          ]
          csv << [
            @applicant[:student_number],
            @applicant[:last_name],
            @applicant[:first_name],
            @application[:access_acad_history].downcase,
            @applicant[:email]
          ]
        end
      end
      subject { generator.generate_transcript_access(session[:id]) }

      it "returns generated true and data of all cdf info" do
        expect(subject).to eq ({generated: true, data: @data, type: "text/csv",
          file: "transcript_access.csv"})
      end

    end
  end

end
