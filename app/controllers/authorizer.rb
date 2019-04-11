module Authorizer

  require 'base64'
  SECURITY = {
    verify_user: ENV['RAILS_ENV'] == 'production' || ENV['AUTHENTICATE_IN_DEV_MODE'].downcase == 'true',
    allow_basic_auth: ENV['ALLOW_BASIC_AUTH'].downcase == 'true',
    basic_auth_ta_id: ENV['BASIC_AUTH_TA_ID']
  }

  def tapp_access
    expected_roles = ["tapp_admin", "tapp_assistant", "instructor"]
    access(expected_roles)
  end

  def tapp_admin()
    expected_roles = ["tapp_admin"]
    access(expected_roles)
  end

  def cp_access
    expected_roles = ["cp_admin", "hr_assistant", "instructor"]
    access(expected_roles)
  end

  def app_access
    expected_roles = ["tapp_admin","cp_admin", "tapp_assistant", "hr_assistant", "instructor"]
    access(expected_roles)
  end

  def cp_admin(hr_assistant = false)
    if hr_assistant
      expected_roles = ["cp_admin", "hr_assistant"]
    else
      expected_roles = ["cp_admin"]
    end
    access(expected_roles)
  end

  def either_admin_instructor(hr_assistant = false)
    if !params[:utorid]
      if hr_assistant
        expected_roles = ["tapp_admin", "cp_admin", "hr_assistant"]
      else
        expected_roles = ["tapp_admin", "cp_admin"]
      end
      access(expected_roles)
    else
      if SECURITY[:verify_user]
        expected_roles = ["instructor"]
        if has_access(expected_roles)
          if session[:utorid] == params[:utorid] && !has_access(["cp_admin"])
            render status: 403, file: 'public/403.html'
          end
        else
          render status: 403, file: 'public/403.html'
        end
      end
    end
  end

  def either_cp_admin_instructor(hr_assistant = false)
    if !params[:utorid]
      if hr_assistant
        expected_roles = ["cp_admin", "hr_assistant"]
      else
        expected_roles = ["cp_admin"]
      end
      access(expected_roles)
    else
      if SECURITY[:verify_user]
        expected_roles = ["instructor"]
        if has_access(expected_roles)
          if session[:utorid] == params[:utorid] && !has_access(["cp_admin"])
            render status: 403, file: 'public/403.html'
          end
        else
          render status: 403, file: 'public/403.html'
        end
      end
    end
  end


  def both_cp_admin_instructor(model, attr_name = :id, array = false)
    if SECURITY[:verify_user]
      expected_roles = ["cp_admin", "instructor"]
      if has_access(expected_roles)
        if !has_access(["cp_admin"])
          instructor = Instructor.find_by(utorid: session[:utorid])
          correct_instructor(model, instructor, params[attr_name], array)
        end
      else
        render status: 403, file: 'public/403.html'
      end
    end
  end

  '''
    Checks if the applicant authenticated by Shibboleth matches
    the utorid of the applicant the offer was made to.
  '''
  def correct_applicant
    if SECURITY[:verify_user]
      utorid = get_utorid
      if session[:roles].nil?
        set_roles
      end
      # When using basic auth, we allow anyone logged in with basic_auth_ta_id
      # to access any TA information.
      if SECURITY[:allow_basic_auth] and session[:roles].include? "ta"
        return
      end
      if utorid != utorid_of_applicant_corresponding_to_student_facing_route(params)
        render status: 403, file: 'public/403.html'
      end
    end
  end

  private
  def logged_in
    if SECURITY[:verify_user]
      set_roles
      if request.env['PATH_INFO'] != '/reenter-session' && !session[:logged_in]
       render file: 'public/logout.html'
      end
    end
  end

  def access(expected_roles)
    set_roles
    if SECURITY[:verify_user]
      if !has_role(expected_roles)
        render status: 403, file: 'public/403.html'
      end
    end
  end

  def has_access(expected_roles)
    set_roles
    return has_role(expected_roles)
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

  def listed_as(users, utorid)
    users = users.split(',')
    if SECURITY[:verify_user]
      return users.include?(utorid)
    end
  end

  def is_instructor
    if SECURITY[:verify_user]
      utorid = get_utorid
      if utorid
        instructor = Instructor.find_by(utorid: utorid)
        return instructor
      else
        return nil
      end
    end
  end

  def utorid_of_applicant_corresponding_to_student_facing_route(params)
    offer = Offer.find(params[:offer_id])
    offer = offer.format
    return offer[:applicant][:utorid]
  end

  '''
    This function depends on the Shibboleth enable reverse proxy
    stuffing in request headers when it forwards.
  '''
  def get_utorid
    if SECURITY[:allow_basic_auth] and request.env['HTTP_AUTHORIZATION']
      begin
        # Apache Basic auth will pass an the HTTP_AUTHORIZATION flag in
        # formatted as `Basic <base64 encoded string>`. When decoded the string
        # will be `user:password` separated by a colon.
        method, encoded_credential = request.env['HTTP_AUTHORIZATION'].split(" ")
        if method.downcase == "basic"
          user, password = Base64.decode64(encoded_credential).split(":")
        end
      rescue
      end
      # Apache will only pass the HTTP_AUTHORIZATION if we have successfully
      # logged in, according to apache. So we will trust this flag
      session[:utorid] = user
      if session[:logged_in].nil?
        session[:logged_in] = true
      end
    end
    if request.env['HTTP_X_FORWARDED_USER']
      session[:utorid] = request.env['HTTP_X_FORWARDED_USER']
      if session[:logged_in].nil?
        session[:logged_in]= true
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
    utorid = get_utorid
    session[:roles] = []
    roles = [
      {
        role: "tapp_admin",
        access: listed_as(ENV['TAPP_ADMINS'], utorid),
      },
      {
        role: "cp_admin",
        access: listed_as(ENV['CP_ADMINS'], utorid),
      },
      {
        role: "tapp_assistant",
        access: listed_as(ENV['TAPP_ASSISTANTS'], utorid),
      },
      {
        role: "hr_assistant",
        access: listed_as(ENV['HR_ASSISTANTS'], utorid),
      },
      {
        role: "ta",
        access: listed_as("#{ENV['TAPP_ADMINS']},#{ENV['CP_ADMINS']},#{SECURITY[:basic_auth_ta_id]}", utorid)
      },
      {
        role: "instructor",
        access: is_instructor,
      }
    ]
    roles.each do |role|
      if SECURITY[:verify_user]
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
  def correct_instructor(model, instructor, inputs, array)
    if instructor
      if array
        allowed = []
        inputs.each do |id|
          data = model.find(id)
           if instructor_access(model, data, instructor)
            allowed.push(id)
          end
        end
        inputs = allowed
      else
        data = model.find(inputs)
         if instructor_access(model, data, instructor)
          render status: 403, file: 'public/403.html'
        end
      end
    else
      render status: 403, file: 'public/403.html'
    end
  end

  def instructor_access(model, data, instructor)
    case model
    when Position
      return data.instructor_ids.include?instructor[:id]
    else
       return data[:instructor_id] == instructor[:id]
    end
  end

end
