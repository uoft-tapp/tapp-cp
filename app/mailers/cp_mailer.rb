class CpMailer < ApplicationMailer
  default from: ENV['EMAIL_USER']

  layout "mailer"

  def contract_email(user)
    @user = user
    Rails.logger.debug "HERE #{@user[:filename]}"
    @url = "http://google.com"
    attachments[@user[:filename]] = File.read(@user[:filename])
    mail(to: @user[:email], subject: "Testing Email")
  end
end
