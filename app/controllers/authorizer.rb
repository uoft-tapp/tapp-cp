module Authorizer
  def tapp_admin
    is_admin(ENV['TAPP_ADMINS'])
  end

  def cp_admin
    is_admin(ENV['CP_ADMINS'])
  end

  def correct_applicant
    if ENV['RAILS_ENV'] == 'production'
      if request.env['HTTP_X_FORWARD_USER']!= get_applicant(params)
        render status: 403, json: {message: "You are not authorized to access this page."}
      end
    end
  end

  private
  def is_admin(admins)
    admins = admins.split(',')
    if ENV['RAILS_ENV'] == 'production'
      if !admins.include?(request.env['HTTP_X_FORWARD_USER'])
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
end
