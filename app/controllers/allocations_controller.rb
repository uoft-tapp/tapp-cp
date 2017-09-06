class AllocationsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  include Model
  before_action :cp_access

  def index
    if params[:ddah_id]
      render json: get_all_allocations(params[:ddah_id], :ddah_id)
    elsif params[:template_id]
      render json: get_all_allocations(params[:template_id], :template_id)
    else
      render json: Allocation.all.to_json
    end
  end

  def show
    if params[:ddah_id]
      allocations = id_array(get_all_allocations(params[:ddah_id], :ddah_id))
      if allocations.include?(params[:id])
        allocation = Allocation.find(params[:id])
        render json: allocation.to_json
      else
        render status: 404, json: {status: 404}
      end
    elsif params[:template_id]
      allocations = id_array(get_all_allocations(params[:template_id], :template_id))
      if allocations.include?(params[:id])
        allocation = Allocation.find(params[:id])
        render json: allocation.to_json
      else
        render status: 404, json: {status: 404}
      end
    else
      allocation = Allocation.find(params[:id])
      render json: allocation.to_json
    end
  end

  private
  def get_all_allocations(val, attr)
    allocations = []
    Allocation.all.each do |allocation|
      if allocation[attr] == val
        allocations.push(allocation)
      end
    end
    return allocations
  end

end
