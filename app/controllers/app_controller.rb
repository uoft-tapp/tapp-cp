class AppController < ApplicationController
  skip_before_action :verify_authenticity_token
  include Authorizer
  before_action :tapp_admin, only: [:tapp]
  before_action :cp_access, only: [:cp]
  before_action :app_access, only: [:roles]
  before_action :correct_applicant, only: [:student_view]

  ''' TAPP functions '''
  def tapp
    render :tapp , layout: false
  end

  ''' CP functions '''
  def cp
    render :cp, layout: false
  end

  def roles
    if ENV['RAILS_ENV'] == 'production'
      render json: {development: false, utorid: session[:utorid], roles: session[:roles]}
    else
      render json: {development: true, utorid: "development", roles: session[:roles]}
    end
  end

  def student_view
    offer = Offer.find(params[:offer_id])
    if offer
      if offer[:send_date]
        @offer = offer.format.merge({mangled: offer[:link]})
        render :decision, layout: false
      else
        render status: 404, json: {message: "Offer #{offer[:id]} hasn't been sent."}
      end
    else
      render status: 404, json: {message: "There is no such page."}
    end
  end

  def ddah_view
    ddah = Ddah.find_by(offer_id: params[:offer_id])
    if ddah
      offer = Offer.find(params[:offer_id])
      if offer[:status]== "Sent"
        @ddah = ddah.format
        @offer = offer.format
        render :ddah, layout: false
      else
        render status: 404, json: {message: "Offer #{offer[:id]} hasn't been sent."}
      end
    else
      render status: 404, json: {message: "There is no such page."}
    end
  end

  def logout
    @url = params[:current_page]
    #@_request.reset_session
    #reset_session
    session[:logged_out] = false
    render file: 'public/logout.html'
  end

  def reenter_session
    session[:logged_in] = true
  end

end
