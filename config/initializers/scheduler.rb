require 'rufus-scheduler'

s = Rufus::Scheduler.singleton

s.cron('0 7 * * *') do
  date = DateTime.now
  today = date.strftime("%A")
  if today != "Sunday" && today != "Saturday"
    if today == "Monday"
      yesterday = date.days_ago(3)
      time_elapsed = "3 days"
    else
      yesterday = date.days_ago(1)
      time_elapsed = "24 hours"
    end
    num_offers = 0
    Offer.all.each do |offer|
      if offer[:accept_datetime]
        if offer[:accept_datetime]>=yesterday && offer[:status]=="Accepted"
          num_offers+=1
        end
      end
    end
    if num_offers> 0
      CpMailer.status_email(num_offers, time_elapsed).deliver_now
    end
  end
end
