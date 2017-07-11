class HelloReactController < ApplicationController
  def contracts
    @contractor = Contractor.new("seeds/offers.json")
    @contractor.build_contracts
    render json: @contractor.get_parsed
  end
end

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
    @session = candidate["session"]
    @year = candidate["year"]
    @start_date = "May 9, 2017"
    @end_date = "Aug 31, 2017"

  end

  def build_contract
    define_grid(columns: 1, rows: 10, gutter: 0)
    insert_title
    insert_intro
    insert_calculations
    insert_cupe
    insert_signoff
  end

  private
  def insert_title
    grid([0,0], [1,0]).bounding_box do
      stroke_color 100, 100, 0, 0
      text "Logo will go here"
      rectangle [-35, 180], 300, 100
      stroke
    end

    grid([1,0], [2,0]).bounding_box do
      font "Times-Roman"
      font_size 20
      text_box "TEACHING ASSISTANT CONTRACT", style: :bold, at: [0, 130], align: :center
      text_box "#{@session} Session #{@year}", style: :bold, at: [0, 110], align: :center
    end
  end

  private
  def insert_intro
    grid([2,0],[3,0]).bounding_box do
      font_size 12
      text "Dear #{@first_name} #{@last_name},"
      move_down 5
      text "We are please to offer you a position as a Teaching Assistant in the Department of Computer Science " +
      "during the period of <b>#{@start_date}</b> to <b>#{@end_date}</b>. Your assignment will be <b>#{@position}</b>. (We reserver the " +
      "right to change your appointment from this course to another course, if necessary). The total time involved " +
      "in the assignment is <b>#{@hours}</b>. The salary for this position is governed by the collective aggreement " +
      "between the University of Toronto and the Canadian Union of Public Employees, Local 3902, a copy of which " +
      "will be provided upon request. The current rate of pay for UG = $43.65; SGS I and SGS II/PDF = $43.65. " +
      "According to the collective aggreement the total sum paid to you for the appintment described above will be :",
      indent_paragraphs: 30, inline_format: true
    end
  end

  private
  def insert_calculations
    grid([4,0],[5,0]).bounding_box do
      stroke_color 100, 100, 0, 0
      rectangle [100, 130], 300, 100
      text_box "calculations go here", at: [120, 110]
      stroke
    end
  end

  private
  def insert_cupe
    grid([6,0],[8,0]).bounding_box do
      text "If this is your first appointment  after  becoming  a  Ph.D.  student,  you  will  be  guaranteed  three  more " +
      "appointments of the same number of hours in subsequent years as per Article 16.05 of the CUPE 3902 (Unit1) Collective Agreement." +
      "If this is not your first appointment, you may still be owed one or more subsequent " +
      "appointments under the aforementioned Article. If this is the case, you may consult the letter you received last April, where your " +
      "appointment status was summarized. Please feel free to contact Karen Reid to seehow various guarantees fit together.",
      indent_paragraphs: 30

      move_down 10

      text "You will soon be given the opportunity to review the Description of Duties and Allocation of Hours(DDAH) form, which will set out " +
      "more specifically the duties of your position, and the hours assigned to each.",
      indent_paragraphs: 30

      text "Please also be advised that in accepting this	offer	of appointment, you are accepting the responsibility " +
      "during	the	course of	your appointment for contacting	your supervisor immediately if you have any questions " +
      "or concerns relating to the hours of	work as set out in your job description, in order	that these may be " +
      "discussed and resolved at the earliest opportunity. Do not make any alterations or add any written " +
      "statements to the form, or the offer of employment will be invalidated.",
      indent_paragraphs: 30
    end

  end

  private
  def insert_signoff
    grid([9,0],[10,0]).bounding_box do
      text "SIGNATURE"
    end
  end
end
