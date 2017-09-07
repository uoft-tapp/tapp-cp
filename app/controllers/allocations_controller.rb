class AllocationsController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  include Model
  before_action :cp_access

  def index
    if params[:ddah_id]
      render json: get_all_allocations(params[:ddah_id], :ddah_id)
    elsif params[:allocation_id]
      render json: get_all_allocations(params[:allocation_id], :allocation_id)
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
    elsif params[:allocation_id]
      allocations = id_array(get_all_allocations(params[:allocation_id], :allocation_id))
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

  def create
    if params[:template_id]
      template = Template.find(params[:template_id])
      template.allocations.create!(
        num_unit: params[:num_unit],
        type: params[:type],
        minutes: params[:minutes],
        duty_id: params[:duty_id],
      )
    elsif params[:ddah_id]
      ddah = Ddah.find(params[:ddah_id])
      ddah.allocations.create!(
        num_unit: params[:num_unit],
        type: params[:type],
        minutes: params[:minutes],
        duty_id: params[:duty_id],
      )
    end
  end

  def destroy
    allocation = Allocation.find(params[:id])
    allocation.destroy!
  end

  def update
    allocation = Allocation.find(params[:id])
    allocation.update_attributes!(allocation_params)
  end

  private
  def allocation_params
    params.permit(:num_unit, :type, :minutes, :duty_id)
  end

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
