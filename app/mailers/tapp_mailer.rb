class TappMailer < ApplicationMailer
  default from: ENV['EMAIL_USER']
  layout "mailer"
  include Mailer

  def assignment_email(position, instructor, applicants)
    @applicants = applicants
    @instructor = instructor
    session = Session.find(position[:session_id])
    @position = "#{session[:semester]} #{session[:year]} #{position[:position]}"
    mail_to(instructor[:email], "#{@position} Tentative TA Assignments")
  end

end
