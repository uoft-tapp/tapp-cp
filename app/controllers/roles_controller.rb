class RolesController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def login
    admins = ENV["ADMINS"].split(",")
    if admins.include? params[:utorid]
      session[:role] = "Admin"
      session[:utorid] = params[:utorid]
      render json: session
    else
      render status: 404, json: {message: "#{params[:utorid]} is not a valid user."}
    end
  end

  def logout
    session[:role] = nil
    session[:utorid] = nil
    render json: session
  end

  def test
    render :test, layout: false
  end
end
