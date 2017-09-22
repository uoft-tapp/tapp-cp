class CpMailer < ApplicationMailer
  default from: ENV['EMAIL_USER']
  layout "mailer"

  def contract_email(offer, link)
    email = get_email(offer[:applicant][:email])
    @offer = offer
    @url = link
    mail(to: email, subject: "TA Position Offer: #{@offer[:position]}")
  end

  def nag_email(contract, link)
    email = get_email(contract[:applicant][:email])
    @contract = contract
    @contract[:nag_suffix] = get_nag_suffix(@contract[:nag_count])
    @contract[:deadline] = format_time(@contract[:deadline],"%I:%M%p on %B %d, %Y")
    @url = link
    mail(to: email, subject: "Reminder for TA Position: #{@contract[:position]}")
  end

  def status_email(num_accepted, time_elapsed)
    @num_accepted = num_accepted
    @time_elapsed = time_elapsed
    email = get_email(ENV["HR_ADMIN_EMAIL"])
    mail(to: email, subject: "CP Alert: New Offers Accepted")
  end

  def ddah_email(ddah, link)
    email = get_email(ddah[:applicant][:email])
    @ddah = ddah
    @url = link
    mail(to: email, subject: "DDAH Form: TAship of #{ddah[:position][:position]}")
  end

  def instructor_nag_email(offer, instructor)
    email = get_email(instructor[:email])
    @offer = offer
    @instructor = instructor
    @offer[:nag_suffix] = get_nag_suffix(@offer[:ddah_nag_count])
    mail(to: email, subject: "DDAH Reminder: #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s Form for #{offer[:position]} is Due")
  end

  def ddah_nag_email(ddah, link)
    email = get_email(ddah[:applicant][:email])
    @ddah = ddah
    @ddah[:nag_suffix] = get_nag_suffix(@ddah[:nag_count])
    puts @ddah[:send_date]
    @ddah[:deadline] = format_time(@ddah[:deadline],"%I:%M%p on %B %d, %Y")
    @url = link
    mail(to: email, subject: "Reminder for TA Position: #{@ddah[:position][:position]}")
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
      return email
    end
  end

  def format_time(time, form)
    time = time.in_time_zone('Eastern Time (US & Canada)')
    return time.strftime(form)
  end

end
