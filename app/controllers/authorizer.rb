module Authorizer
  ```
    ENV['TAPP_ADMINS'] is environmental variable from .env
    The data format is CSV.
  ```
  def tapp_admin
    if !listed_as(ENV['TAPP_ADMINS'])
      render status: 403, file: 'public/403.html'
    else
  end

  ```
    ENV['CP_ADMINS'] and ENV['HR_ASSISTANTS'] are environmental variable from .env
    The data format is CSV.
  ```
  def cp_access
    if !listed_as(ENV['CP_ADMINS'])||!listed_as(ENV['HR_ASSISTANTS'])||!is_instructor
      render status: 403, file: 'public/403.html'
    end
  end

  ```
    Checks if the applicant authenticated by Shibboleth matches
    the utorid of the applicant the offer was made to.
  ```
  def correct_applicant
    if ENV['RAILS_ENV'] == 'production'
      if get_utorid != utorid_of_applicant_corresponding_to_student_facing_route(params)
        render status: 403, file: 'public/403.html'
      end
    end
  end

  private
  def listed_as(users)
    users = users.split(',')
    if ENV['RAILS_ENV'] == 'production'
      return users.include?(get_utorid)
    end
  end

  def is_instructor
    if ENV['RAILS_ENV'] == 'production'
      return Instructor.find_by(utorid: get_utorid)
    end
  end

  def utorid_of_applicant_corresponding_to_student_facing_route(params)
    offer = Offer.find_by(link: params[:mangled])
    if offer
      offer = offer.format
      return offer[:applicant][:utorid]
    else
      render status: 404, file: 'public/404.html'
    end
  end

  ```
    This function depends on the Shibboleth enable reverse proxy
    stuffing in request headers when it forwards.
  ```
  def get_utorid
    if request.env['HTTP_X_FORWARDED_USER']
      session[:utorid] = request.env['HTTP_X_FORWARDED_USER']
      set_cookie_keys
      set_roles
      return session[:utorid]
    else
      return session[:utorid]
    end
  end

  def set_roles
    session[:roles] = []
    roles = [
      {
        access: listed_as(ENV['TAPP_ADMINS']),
        role: "tapp_admin",
      },
      {
        access: listed_as(ENV['CP_ADMINS']),
        role: "cp_admin",
      },
      {
        access: listed_as(ENV['HR_ASSISTANTS']),
        role: "hr_assistant",
      },
      {
        access: is_instructor,
        role: "instructor",
      }
    ]
    roles.each do |role|
      if role[:access]
        session[:roles].push(role[:role])
      end
    end
  end

  ```
    Sets the keys of the cookies from Shibboleth as part of the array in
    session[:keys], so that the cookie can be deleted.
  ```
  def set_cookie_keys
     session[:keys]=[]
     cookies = request.env['HTTP_COOKIE'].split(";")
     cookies.each do |cookie|
       key = cookie.strip.split("=")
       session[:keys].push(key[0])
     end
  end
end
