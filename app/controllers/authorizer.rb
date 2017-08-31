module Authorizer
  def tapp_admin
    is_admin(ENV['TAPP_ADMINS'])
  end

  def cp_admin
    is_admin(ENV['CP_ADMINS'])
  end

  def correct_applicant
    if ENV['RAILS_ENV'] == 'production'
      if get_utorid != get_applicant(params)
        render status: 403, json: {message: "You are not authorized to access this page."}
      end
    end
  end

  def logout
    reset_session
  end

  private
  def is_admin(admins)
    admins = admins.split(',')
    if ENV['RAILS_ENV'] == 'production'
      if !admins.include?(get_utorid)
        render status: 403, json: {message: "You are not authorized to access this page."}
      end
    end
  end

  def get_applicant(params)
    offer = Offer.find_by(link: params[:mangled])
    if offer
      offer = offer.format
      return offer[:applicant][:utorid]
    else
      render status: 404, json: {message: "Page not found."}
    end
  end

  def get_utorid
    if request.env['HTTP_X_FORWARD_USER']
      session[:utorid] = request.env['HTTP_X_FORWARD_USER']
      return session[:utorid]
    else
      return session[:utorid]
    end
  end
end
