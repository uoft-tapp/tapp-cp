class AppController < ActionController::Base
  protect_from_forgery with: :exception
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def test
    @contracts = Contract.all.map { |c| c.format }
    render :test, layout: false
  end

  private
  def record_not_found
    render status: :not_found, json: { status: 404 }
  end

end
