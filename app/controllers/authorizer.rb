module Authorizer
  def tapp_admin
    set_roles
    expected_roles = ["tapp_admin"]
    access(expected_roles)
  end

  def cp_access
    set_roles
    expected_roles = ["cp_admin", "hr_assistant", "instructor"]
    access(expected_roles)
  end

  def app_access
    set_roles
    expected_roles = ["tapp_admin","cp_admin", "hr_assistant", "instructor"]
    access(expected_roles)
  end

  def cp_admin(hr_assistant = false)
    set_roles
    if hr_assistant
      expected_roles = ["cp_admin", "hr_assistant"]
    else
      expected_roles = ["cp_admin"]
    end
    access(expected_roles)
  end

  def either_admin_instructor(hr_assistant = false)
    if !params[:utorid]
      set_roles
      if hr_assistant
        expected_roles = ["tapp_admin", "cp_admin", "hr_assistant"]
      else
        expected_roles = ["tapp_admin", "cp_admin"]
      end
      access(expected_roles)
    end
  end

  def either_cp_admin_instructor(hr_assistant = false)
    if !params[:utorid]
      set_roles
      if hr_assistant
        expected_roles = ["cp_admin", "hr_assistant"]
      else
        expected_roles = ["cp_admin"]
      end
      access(expected_roles)
    end
  end


  def both_cp_admin_instructor(model, attr_name = :id, array = false)
    set_roles
    expected_roles = ["cp_admin", "instructor"]
    if has_access(expected_roles)
      if !has_access(["cp_admin"])
        instructor = Instructor.find_by(utorid: session[:utorid])
        correct_instructor(model, instructor[:id], attr_name, array)
      end
    else
      render status: 403, file: 'public/403.html'
    end
  end

  '''
    Checks if the applicant authenticated by Shibboleth matches
    the utorid of the applicant the offer was made to.
  '''
  def correct_applicant
    if ENV['RAILS_ENV'] == 'production'
      utorid = get_utorid
      if !session[:logged_in]
        render file: 'public/logout.html'
      else
        if utorid != utorid_of_applicant_corresponding_to_student_facing_route(params)
          render status: 403, file: 'public/403.html'
        end
      end
    end
  end

  private
  def access(expected_roles)
    if ENV['RAILS_ENV'] == 'production'
      if !session[:logged_in]
        render file: 'public/logout.html'
      else
        if !has_role(expected_roles)
          render status: 403, file: 'public/403.html'
        end
      end
    end
  end

  def has_access(expected_roles)
    if ENV['RAILS_ENV'] == 'production'
      if !session[:logged_in]
        render file: 'public/logout.html'
      else
        return !has_role(expected_roles)
      end
    end
  end

  def has_role(expected_roles)
    session[:roles].each do |role|
      expected_roles.each do |expected|
        if expected == role
          return true
        end
      end
    end
    return false
  end

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
    offer = Offer.find(params[:offer_id])
    if offer
      offer = offer.format
      return offer[:applicant][:utorid]
    else
      render status: 404, file: 'public/404.html'
    end
  end

  '''
    This function depends on the Shibboleth enable reverse proxy
    stuffing in request headers when it forwards.
  '''
  def get_utorid
    if request.env['HTTP_X_FORWARDED_USER']
      session[:utorid] = request.env['HTTP_X_FORWARDED_USER']
      if session[:logged_in].nil?
        Rails.logger.info("logged_in is nil")
        Rails.logger.info("logged_in value is #{session[:logged_in]}")
        session[:logged_in]= true
      else
        Rails.logger.info("logged_in is already assigned")
      end
      return session[:utorid]
    else
      return session[:utorid]
    end
  end

  '''
    ENV["TAPP_ADMINS"], ENV["CP_ADMINS"] and ENV["HR_ASSISTANTS"]
    are all environmental variable from .env
    The data format is CSV.
  '''
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
      if ENV['RAILS_ENV'] == 'production'
        if role[:access]
          session[:roles].push(role[:role])
        end
      else
        session[:roles].push(role[:role])
      end
    end
  end

  '''
   assumes that instructor_id is an attribute in the model
  '''
  def correct_instructor(model, instructor_id, attr_name = :id, array = false)
    if array
      allowed = []
      params[attr_name].each do |id|
        model = model.find(id)
        if model[:instructor_id] = instructor_id
          allowed.push(id)
        end
      end
      params[attr_name] = allowed
    else
      model = model.find(params[attr_name])
      if model[:instructor_id] != instructor_id
        render status: 403, file: 'public/403.html'
      end
    end
  end

end
