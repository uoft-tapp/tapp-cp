class CpMailer < ApplicationMailer
  default from: ENV['EMAIL_USER']
  layout "mailer"

  def contract_email(offer, link)
    email = get_email(offer)
    @offer = offer
    @url = link
    mail(to: email, subject: "TA Position Offer: #{@offer[:position]}")
  end

  def nag_email(contract, link)
    email = get_email(contract)
    @contract = contract
    @contract[:nag_suffix] = get_nag_suffix(@contract[:nag_count])
    @contract[:deadline] = format_time(@contract[:deadline],"%I:%M%p on %B %d, %Y")
    @url = link
    mail(to: email, subject: "Reminder for TA Position: #{@contract[:position]}")
  end

  private
  def get_nag_suffix(nag_count)
    case nag_count
    when 1
      return "st"
    when 2
      return "nd"
    when 3
      return "rd"
    else
      return "th"
    end
  end

  def get_email(email)
    if ENV['RAILS_ENV'] == 'development'
      return ENV['RECIPIENT']
    elsif ENV['RAILS_ENV'] == 'production'
      return email[:applicant][:email]
    end
  end

  def format_time(time, form)
    time = time.in_time_zone('Eastern Time (US & Canada)')
    return time.strftime(form)
  end

end
