class ExportController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    exporter = ChassExporter.new
    response = exporter.export(params[:round_id])
    render_helper(response)
  end

  def cdf
    generator = CSVGenerator.new
    response = generator.generate_cdf_info
    render_helper(response)
  end

  def offers
    generator = CSVGenerator.new
    response = generator.generate_offers
    render_helper(response)
  end

  def transcript_access
    generator = CSVGenerator.new
    response = generator.generate_transcript_access
    render_helper(response)
  end

  private
  def render_helper(response)
    if response[:generated]
      send_data response[:data], :filename => response[:file],
      content_type: response[:type]
    else
      render status: 404, json: {
        message: response[:msg]
      }.to_json
    end
  end

end
