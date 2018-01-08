class CpMailer < ApplicationMailer
  default from: ENV['EMAIL_USER']
  layout "mailer"

  def contract_email(offer, link)
    @offer = offer
    @url = link
    mail_to(offer[:applicant][:email], "TA Position Offer: #{@offer[:position]}")
  end

  def nag_email(contract, link)
    @contract = contract
    @contract[:nag_suffix] = get_nag_suffix(@contract[:nag_count])
    @contract[:deadline] = format_time(@contract[:deadline],"%I:%M%p on %B %d, %Y")
    @url = link
    mail_to(contract[:applicant][:email], "Reminder for TA Position: #{@contract[:position]}")
  end

  def status_email(num_accepted, time_elapsed)
    @num_accepted = num_accepted
    @time_elapsed = time_elapsed
    mail_to(ENV["HR_ADMIN_EMAIL"], "CP Alert: New Offers Accepted")
  end

  def ddah_email(ddah, link)
    @ddah = ddah
    @url = link
    mail_to(ddah[:applicant][:email], "DDAH Form: TAship of #{ddah[:position][:position]}")
  end

  def instructor_nag_email(offer, instructor)
    @offer = offer
    @instructor = instructor
    @offer[:nag_suffix] = get_nag_suffix(@offer[:ddah_nag_count])
    mail_to(instructor[:email], "DDAH Reminder: #{offer[:applicant][:first_name]} #{offer[:applicant][:last_name]}'s Form for #{offer[:position]} is Due")
  end

  def ddah_nag_email(ddah, link)
    @ddah = ddah
    @ddah[:nag_suffix] = get_nag_suffix(@ddah[:nag_count])
    @ddah[:deadline] = format_time(@ddah[:deadline],"%I:%M%p on %B %d, %Y")
    @url = link
    mail_to(ddah[:applicant][:email], "Reminder for TA Position: #{@ddah[:position][:position]}")
  end

  def assignment_email(position, instructor, applicants)
    @applicants = applicants
    @instructor = instructor
    session = Session.find(position[:session_id])
    @position = "#{session[:semester]} #{session[:year]} #{position[:position]}"
    mail_to(instructor[:email], "#{@position} Tentative TA Assignments")
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

  def mail_to(email, subject)
    email = get_email(email)
    mail(to: email, subject: subject)
  end

  def get_email(email)
    if ENV['RAILS_ENV'] == 'development'
      return ENV['RECIPIENT']
    elsif ENV['RAILS_ENV'] == 'production'
      if ENV['domain'].include?('tapp')
        return email
      else
        return ENV['RECIPIENT']
      end
    end
  end

  def format_time(time, form)
    time = time.in_time_zone('Eastern Time (US & Canada)')
    return time.strftime(form)
  end

end
