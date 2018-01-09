class TappMailer < ApplicationMailer
  default from: ENV['EMAIL_USER']
  layout "mailer"

  def assignment_email(position, instructor, applicants)
    @applicants = applicants
    @instructor = instructor
    session = Session.find(position[:session_id])
    @position = "#{session[:semester]} #{session[:year]} #{position[:position]}"
    mail_to(instructor[:email], "#{@position} Tentative TA Assignments")
  end

  private
  def mail_to(email, subject)
    email = get_email(email)
    mail(to: email, subject: subject)
  end

  def get_email(email)
    if ENV['RAILS_ENV'] == 'development'
      return ENV['RECIPIENT']
    elsif ENV['RAILS_ENV'] == 'production'
      if ENV['domain'].include?('sleepy')
        return ENV['RECIPIENT']
      else
        return email
      end
    end
  end

end
