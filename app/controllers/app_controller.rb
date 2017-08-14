class AppController < ActionController::Base
  def test
    @offers = Offer.all.map {|o| o.format }
    @sessions = Session.all.map {|s| s.json }
    puts @sessions
    render :test, layout: false
  end

  def decision
    applicant = Applicant.find_by_utorid(params[:utorid])
    if applicant
      position = Position.find(params[:position_id]).json
      if position
        offer = Offer.find_by(applicant_id: applicant[:id], position_id: position[:id])
        if offer
          if offer[:send_date]
            @offer = offer.format
            render :decision, layout: false
          else
            render status: 404, json: {message: "Offer #{offer.json[:id]} hasn't been sent."}
          end
        else
          render status: 404, json: {message: "TAship for #{position[:position]} was not offered to #{applicant[:first_name]} #{applicant[:last_name]}."}
        end
      else
        render status: 404, json: {message: "No such position."}
      end
    else
      render status: 404, json: {message: "No such applicant."}
    end
  end

end
