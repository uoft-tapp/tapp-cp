class CategoriesController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :cp_access

  def index
    render json: Category.all.to_json
  end

  def show
    category = Category.find(params[:id])
    render json: category.to_json
  end

end
