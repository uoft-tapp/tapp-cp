class DdahGenerator
  include Prawn::View
  Prawn::Font::AFM.hide_m17n_warning = true
  TITLE = 1
  REGULAR_LEFT_ALIGN = 2
  REGULAR_CENTER = 3
  REGULAR_CHECKLIST = 4
  SMALL_CENTER = 5
  SMALL_LEFT_ALIGN = 6
  HEADER_X_COORD = 0.7
  HEADER_Y_COORD = 0.5
  CHECKBOX = "\u2610"
  FILLED_CHECKBOX = "\u2611"
  RADIOBUTTON = "\u25CB"
  FILLED_RADIOBUTTON = "\u29BF"

  def initialize(ddah, template = false)
    @ddah = ddah
    @whitespace = Prawn::Text::NBSP * 5
    @tab = Prawn::Text::NBSP * 10
    define_grid(columns: 75, rows: 100, gutter: 0)
    templates = ["ddah_header", "allocations"]
    @parser = TemplateParser.new(templates, @ddah, "ddah")
    header_end = set_header(HEADER_X_COORD, HEADER_Y_COORD, @parser.get_data("ddah_header"))
    set_allocation_table(HEADER_X_COORD, header_end, @parser.get_data("allocations"))
    start_new_page
    training_end = set_training(HEADER_Y_COORD)
    summary_end = set_summary(training_end)
    signature_end = set_signature(template, summary_end)
    set_review_box(signature_end)
  end

  private
  def get_font(name)
    ttf = "#{Rails.root}/app/services/templates/fonts/#{name}.ttf"
    font_families.update(
    name => { bold: ttf,
                italic: ttf,
                bold_italic: ttf,
                normal: ttf })
    return name
  end

  def get_style(type, text)
    case type
    when TITLE
      return {
        font: "Times-Roman",
        font_size: 12,
        text: text,
        align: :center,
      }
    when REGULAR_LEFT_ALIGN
      return {
        font: "Times-Roman",
        font_size: 9,
        text: text,
        align: :left,
      }
    when REGULAR_CHECKLIST
      return {
        font: get_font("Symbola"),
        font_size: 8,
        text: text,
        align: :left,
      }
    when REGULAR_CENTER
      return {
        font: "Times-Roman",
        font_size: 9,
        text: text,
        align: :center,
      }
    when SMALL_CENTER
      return {
        font: "Times-Roman",
        font_size: 6,
        text: text,
        align: :center,
      }
    when SMALL_LEFT_ALIGN
      return {
        font: get_font("Symbola"),
        font_size: 7,
        text: text,
        align: :left,
      }
    end
  end

  # In Prawn, text/image can be inserted by drawing them within a grid. A grid
  # contains its top-left coordinates and its bottom-right coordinates.
  # In the initialize(), each page was basically divided into a 85 X 110 grid.
  # This basically sets up the page coordinates by 0.1 inches since it is by default
  # an A4 document. The function below basically takes the x, y as inches converts them
  # to grid arrays. It also takes width and height in inches and calculate the coordinates
  # for the bottom-right corner of the grid.
  def get_grids(x, y, width, height)
    x = (x*10)-5
    y = (y*10)-5
    end_x= x+(width*10)-1
    end_y= y+(height*10) -1
    return [[y, x], [end_y, end_x]]
  end

  def draw_box(grids, shaded = false, color = 'DDDDDD')
    grid(grids[0], grids[1]).bounding_box() do
      stroke_bounds
      if shaded
        stroke do
          fill_color color
          fill_and_stroke_rectangle [0,bounds.height], bounds.width, bounds.height
          fill_color '000000'
        end
      end
    end
  end


  # set_text() create a grid at the coordinates specified by grids.
  # It also sets the font, font_size, alignment of the text in parameter, data,
  # inside the created grid. "fill", by default, is false so that there is no
  # border or background color to the grid created. The "top_padding" is also
  # false by default, so that there is no unintended top_padding to the text within
  # the grid.
  # "fill" and "top_padding" are used as part of the office only form to create the grid.
  def set_text(grids, data, fill = false, top_padding = false, pad = 7)
    grid(grids[0], grids[1]).bounding_box() do
      font data[:font]
      font_size data[:font_size]
      if top_padding
        move_down pad
      end
      if fill
        stroke_bounds
        text "#{Prawn::Text::NBSP * 1}#{data[:text]}", inline_format: true, align: data[:align]
        if data[:text]==""
          stroke do
            fill_color 'DDDDDD'
            fill_and_stroke_rectangle [0,bounds.height], bounds.width, bounds.height
            fill_color '000000'
          end
        end
      else
        text data[:text], inline_format: true, align: data[:align]
      end
    end
  end


  def set_logo(grids)
    logo = "#{Rails.root}/app/assets/images/dcs_logo_blue.jpg"
    grid(grids[0], grids[1]).bounding_box() do
      image logo, at: [0,bounds.height], scale: 0.4
    end
  end

  def set_header(x, y, header_data)
    set_logo(get_grids(x, y-0.1, 1.8, 0.9))
    set_text(get_grids(x, y-0.1, 7.5, 0.4), get_style(TITLE, header_data[0]))
    draw_box(get_grids(0.5, y+0.35, 7.5, 1.3), true)
    y = y+ 0.4
    y = set_header_helper(header_data, 1, y, 0.25)
    set_table_data(4.45, [3.8], 0, y, 0.3, get_scaling_data(header_data), false, SMALL_LEFT_ALIGN)
    set_table_data(2, [1, 1], 0, y+0.2, 0.3, get_optional_data, false, SMALL_LEFT_ALIGN)
    return y+0.1
  end

  def get_optional_data
    if @ddah[:optional]
      [["#{FILLED_RADIOBUTTON} Optional", "#{RADIOBUTTON} Mandatory"]]
    else
      [["#{RADIOBUTTON} Optional", "#{FILLED_RADIOBUTTON} Mandatory"]]
    end
  end

  def get_scaling_data(header_data)
    if @ddah[:scaling_learning]
      [["#{FILLED_CHECKBOX} #{header_data[header_data.length-1]}"]]
    else
      [["#{CHECKBOX} #{header_data[header_data.length-1]}"]]
    end
  end

  def set_header_helper(data, start_index, y, height)
    start = 0.5
    columns=[1.3, 2.5, 1.5, 2.2]
    for i in start_index..data.length-2
      row = convert_to_row(data[i])
      set_table_data(start, columns, 0, y, height, row)
      y+=height
    end
    return y-height
  end

  def convert_to_row(data)
    return [data.split(":")]
  end

  def set_allocation_table(x, y, allocation_data)
    draw_box(get_grids(0.5, y+0.5, 7.5, 0.3))
    set_text(get_grids(0.5, y+0.5, 7.5, 0.3), get_style(TITLE, allocation_data[0]), false, true, 5)
    start = 0.5
    columns=[1, 3.5, 1, 1, 1]
    y = y+ 0.8
    set_table_helper(start, columns, 24, y)
    large_heading = [allocation_data[1].split(":")]
    subtitle = [allocation_data[2].split(":")]
    set_table_data(start, columns, 0, y, 0.3, large_heading, false, REGULAR_CENTER)
    set_table_data(start, columns, 0, y+0.2, 0.5, subtitle, false, SMALL_CENTER)
    set_table_data(start, columns, 25, y, 0.3, [["<b>Total</b>","", get_total_minutes, get_total, ""]])
    set_table_data(start, columns, 1, y, 0.3, get_allocation_data)
  end

  def get_allocation_data
    allocations =[]
    @ddah[:allocations].each do |allocation|
      row = [
        allocation[:num_unit],
        allocation[:unit_name],
        allocation[:minutes],
        get_hours(allocation),
        "",
      ]
      allocations.push(row)
    end
    return allocations
  end


  def set_table_data(start, columns, row, y, height, data, pad = true, style = REGULAR_LEFT_ALIGN)
    curr = 0
    index = 0
    while curr <= row+data.length-1
      if curr >= row
        draw_table_data(start, columns, y, height, data[index], pad, style)
        index+=1
      end
      if curr == 0
        y = y + 0.5
      else
        y = y + height
      end
      curr +=1
    end
  end

  def draw_table_data(start, columns, y, height, data, pad, style)
    columns.each_with_index do |column, index|
      if pad
        data[index] = "#{@whitespace}#{data[index]}"
      end
      set_text(get_grids(get_column_sum(start, columns, index),
        y, columns[index], height),
        get_style(style, data[index]), false, true)
    end
  end

  def set_table_helper(start, columns, rows, y)
    for index in 0..rows+1
      if index == 0
        draw_row(start, columns, y, 0.5, true)
        y = y + 0.5
      elsif index == rows+1
        draw_row(start, columns, y, 0.3)
        y = y + 0.3
      else
        draw_row(start, columns, y, 0.3)
        y = y + 0.3
      end
    end
  end

  def draw_row(start, columns, y, height, shaded = false)
    columns.each_with_index do |column, index|
      if shaded
        draw_box(get_grids(get_column_sum(start, columns, index), y, columns[index], height), true)
      else
        draw_box(get_grids(get_column_sum(start, columns, index), y, columns[index], height))
      end
    end
  end

  def get_column_sum(start, columns, i)
    sum = start
    columns.each_with_index do |val, index|
      if index == i
        return sum
      end
      sum += val
    end
  end

  def set_training(y)
    draw_box(get_grids(0.5, y, 7.5, 0.3))
    set_text(get_grids(0.5, y, 7.5, 0.3), get_style(TITLE, "Training"), false, true, 5)
    draw_box(get_grids(0.5, y+0.3, 7.5, 1.1), true)
    start = 0.5
    column1=[3.9]
    column2=[3.9,4]
    y-=0.2
    set_table_data(start, column2, 1, y, 0.24, [["", "Indicate Tutorial Category (1 primary activity)"]])
    set_table_data(start, column1, 1, y, 0.21, get_checklist(Training, :trainings, 1, 0), true, REGULAR_CHECKLIST)
    set_table_data(start, column2, 1, y+0.2, 0.21, get_checklist(Category, :categories, 2, 1), true, REGULAR_CHECKLIST)
    return y+1.6
  end

  def get_checklist(model, attr, len, index)
    data = []
    model.all.each do |item|
      if @ddah[attr].include?item[:id]
        val = "#{FILLED_CHECKBOX}"
      else
        val = "#{CHECKBOX}"
      end
      row =[]
      for i in 0..len-1
        row.push("")
      end
      row[index]="#{val} #{item[:name]}"
      data.push(row)
    end
    return data
  end

  def set_summary(y)
    y = y+0.1
    draw_box(get_grids(0.5, y, 7.5, 0.3))
    set_text(get_grids(0.5, y, 7.5, 0.3), get_style(TITLE, "Allocation of Hours Summary"), false, true, 5)
    start = 0.5
    columns=[5.5, 1, 1]
    y = y+ 0.3
    duties = get_summary_data
    set_table_helper(start, columns, duties.length, y)
    large_heading = [["Duties", "Initial", "Revised"]]
    subtitle = [["","", "if necessary"]]
    set_table_data(start, columns, 0, y, 0.3, large_heading, false, REGULAR_CENTER)
    set_table_data(start, columns, 0, y+0.2, 0.5, subtitle, false, SMALL_CENTER)
    set_table_data(start, columns, 1, y, 0.3, duties)
    set_table_data(start, columns, duties.length+1, y, 0.3, [["<b>Total</b>",get_total, ""]])
    return y+((duties.length+1)*0.3)+0.7
  end

  def set_signature(template, y)
    titles = ["Prepared by (Supervisor)", "Approved by (Chair/Designated Authority)", "Accepted by (Teaching Assistant)"]
    if template
      signature = [[@ddah[:supervisor], "", ""], [ENV["TA_COORD"], "", ""], ["", "", ""]]
      signature_box(y, titles[0], [signature[0]])
      signature_box(y+0.7, titles[1], [signature[1]])
      signature_box(y+1.4, titles[2], [signature[2]])
    else
      signature = [[@ddah[:supervisor], @ddah[:supervisor_signature], format_date(@ddah[:supervisor_sign_date])],
        [ENV["TA_COORD"], @ddah[:ta_coord_signature], format_date(@ddah[:ta_coord_sign_date])],
        ["#{@ddah[:applicant][:first_name]} #{@ddah[:applicant][:last_name]}", @ddah[:student_signature],
          format_date(@ddah[:student_sign_date])]]
      signature_box(y, titles[0], [signature[0]])
      signature_box(y+0.7, titles[1], [signature[1]])
      signature_box(y+1.4, titles[2], [signature[2]])
    end
    return y+2.1
  end

  def set_review_box(y)
    titles = ["Prepared by (Supervisor)", "Approved by (Chair/Designated Authority)", "Accepted by (Teaching Assistant)"]
    signatures = [@ddah[:review_supervisor_signature], @ddah[:review_ta_coord_signature], @ddah[:review_student_signature]]
    draw_box(get_grids(0.5, y, 7.5, 1), true)
    signature_box(y+0.5, titles[0], [signatures], titles[0],titles[0],[2.35, 2.35, 2.35])
    start = 0.7
    columns=[5, 0.5, 1.55]
    y = y+ 0.1
    text = [["MID COURSE REVIEW CHANGES (if any)", "Date", format_date(@ddah[:review_date])]]
    draw_box(get_grids(start+columns[0]+columns[1], y, 1.55, 0.3), true, "FFFFFF")
    set_table_data(start, columns, 0, y, 0.3, text)
  end

  def format_date(date)
    if date
      date = Date.parse(date)
      date.strftime("%B %e, %Y")
    end
  end

  def signature_box(y, h1, signature, h2="SIGNATURE", h3="Date", columns = [2.9, 2.9, 1.3])
    start = 0.7
    subtitle = [[h1,h2, h3]]
    draw_box(get_grids(start, y, columns[0], 0.3), true, "FFFFFF")
    draw_box(get_grids(start+columns[0], y, columns[1], 0.3), true, "FFFFFF")
    draw_box(get_grids(start+columns[0]+columns[1], y, columns[2], 0.3), true, "FFFFFF")
    set_table_data(start, columns, 0, y, 0.25, signature, false, REGULAR_CENTER)
    set_table_data(start, columns, 0, y+0.25, 0.5, subtitle, false, SMALL_CENTER)
  end

  def get_summary_data
    data = []
    Duty.all.each do |duty|
      row = [duty[:name], 0, ""]
      @ddah[:allocations].each do |allocation|
        if allocation[:duty_id] == duty[:id]
          row[1]+=get_hours(allocation)
        end
      end
      row[1] =  '%.1f' % row[1]
      data.push(row)
    end
    return data
  end

  def get_total_minutes
    total = 0
    @ddah[:allocations].each do |allocation|
      total+=allocation[:minutes]
    end
    return total
  end

  def get_total
    total = 0
    @ddah[:allocations].each do |allocation|
      total+=get_hours(allocation)
    end
    total =  '%.1f' % total
    return total
  end

  def get_hours(allocation)
    (allocation[:num_unit]*allocation[:minutes])/60
  end

end
