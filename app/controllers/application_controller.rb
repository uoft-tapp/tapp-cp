class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  before_action :set_cache_headers
  before_action :logged_in
  include Model

  def execute_sql(sql)
    results = ActiveRecord::Base.connection.execute("#{sql};")
    if results.present?
      return JSON.parse(results.to_json, symbolize_names: true)
    else
      return nil
    end
  end

  private
  def set_cache_headers
    response.headers["Cache-Control"] = "no-cache, no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Mon, 01 Jan 1990 00:00:00 GMT"
  end

  def record_not_found
    render status: :not_found, file: 'public/404.html'
  end
end
