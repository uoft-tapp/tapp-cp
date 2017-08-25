module Authorizer
  def is_admin
    if logged_in
      if session[:role]=="Admin"
        yield
      else
        render status: 403, json: {message: "You are not authorized to access this route."}
      end
    else
      render status: 401, json: {message: "You are not logged in."}
    end
  end

  private
  def logged_in
    return session[:role] && session[:utorid]
  end
end
