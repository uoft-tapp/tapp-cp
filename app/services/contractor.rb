require 'prawn'

class Contractor
  def initialize(file)
    @data = File.read("#{Rails.root}/db/#{file}")
    @parsed = JSON.parse(@data)
  end

  def get_parsed
    return @parsed
  end

  def build_contracts
    @parsed.each do |candidate|
      @sid = candidate["student_number"]
      @position = candidate["position"]
      filename = "#{Rails.root}/tmp/contracts/#{@sid}-#{@position}-contract.pdf"
      contract = Contract.new(candidate)
      contract.build_contract
      contract.save_as(filename)
    end
  end
end


class Contract
  include Prawn::View
  def initialize(candidate)
    @first_name = candidate["first_name"]
    @last_name = candidate["last_name"]
    @email = candidate["email"]
    @address = candidate["address"]
    @phone = candidate["phone"]
    @sid = candidate["student_number"]
    @utorid = candidate["utorid"]
    @position = candidate["position"]
    @hours = candidate["hours"]
  end

  def build_contract
    build_header
    build_body
    build_footer
  end

  private
  def build_header
    text "Hello #{@first_name}"
  end

  private
  def build_body
    text "This is your position: #{@position}"
  end

  private
  def build_footer
    text "And we're done"
  end
end
