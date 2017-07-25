class CpMailer < ApplicationMailer
  default from: ENV['EMAIL_USER']

  layout "mailer"

  def contract_email(offer)
    @offer = offer
    email = "mingtsengeh@gmail.com"
    # for real system use the following
    # currently, we have fake applicant with fake email, so it can't send
    # email = @offer[:applicant]["email"]
    @url = "http://google.com"
    generator = ContractGenerator.new(offer)
    attachments["contract.pdf"] = {mime_type: 'application/pdf', content: generator.render }
    mail(to: email, subject: "TA Position Offer: #{@offer[:position]}")
  end

  def nag_email(contract)
    email = "mingtsengeh@gmail.com"
    # for real system use the following
    # currently, we have fake applicant with fake email, so it can't send
    # email = @contract[:applicant]["email"]
    @contract = contract
    @contract[:nag_suffix] = get_nag_suffix(@contract["nag_count"])
    deadline = @contract[:deadline].in_time_zone('Eastern Time (US & Canada)')
    @contract[:deadline] = deadline.strftime("%I:%M%p on %B %d, %Y")
    @url = "http://google.com"
    generator = ContractGenerator.new(offer)
    attachments["contract.pdf"] = {mime_type: 'application/pdf', content: generator.render }
    mail(to: email, subject: "Reminder for TA Position: #{@contract[:position]}")
  end

  private
  def get_nag_suffix(nag_count)
    puts nag_count
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

end
