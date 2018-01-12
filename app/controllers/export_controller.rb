class ExportController < ApplicationController
  protect_from_forgery with: :null_session
  include Authorizer
  before_action :tapp_admin, except: [:cp_offers]
  before_action only: [:cp_offers] do
    cp_admin(true)
  end
  before_action :cp_admin, only: [:ddahs, :session_ddahs]

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

  def cp_offers
    generator = CSVGenerator.new
    response = generator.generate_cp_offers(params[:session_id])
    render_helper(response)
  end

  def ddahs
    generator = CSVGenerator.new
    response = generator.generate_ddahs(params[:position_id])
    render_helper(response)
  end

  def session_ddahs
    session = Session.find(params[:session_id])
    if session
      filename="#{session[:semester]}_#{session[:year]}_DDAH.zip"
      files = get_session_ddah_files(session)
      if files.size > 0
        binary = Zip::OutputStream.write_buffer do |zio|
          files.each do |file|
            zio.put_next_entry(file[:filename])
            zio.write file[:data]
          end
        end
        send_data binary.string, filename: filename, content_type: 'application/zip'
      else
        render status: 404, json: {message: "Error: None of the courses in this session has any offers."}
      end
    else
      render status: 404, json: {message: "Error: Invalid Session"}
    end
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

  def get_session_ddah_files(session)
    generator = CSVGenerator.new
    positions = get_all_position_in_session(session)
    files = []
    positions.each do |position|
      response = generator.generate_ddahs(position[:id])
      if response[:generated]
        files.push({
          filename: response[:file],
          data: response[:data],
        })
      end
    end
    return files
  end

  def get_all_position_in_session(session)
    positions =[]
    Position.all.each do |position|
      if position[:session_id]==session[:id]
        positions.push(position)
      end
    end
    return positions
  end

end
