module AppMailer
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
