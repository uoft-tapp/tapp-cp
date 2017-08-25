class ContractGenerator
  include Prawn::View
  Prawn::Font::AFM.hide_m17n_warning = true
  TITLE = 1
  REGULAR_LEFT_ALIGN = 2
  SMALL_LEFT_ALIGN = 3
  SIGNATURE = 4
  INITIAL = 5
  HEADER_X_COORD = 0.7
  HEADER_Y_COORD = 0.5

  def initialize(offers, no_office_use_only_box=false)
    offers.each_with_index do |offer, index|
      if index > 0
        start_new_page
      end
      @offer = offer
      @whitespace = Prawn::Text::NBSP * 5
      @tab = Prawn::Text::NBSP * 10
      define_grid(columns: 75, rows: 100, gutter: 0)
      templates = ["header", "letter", "general_info", "signature", "office_form"]
      @parser = TemplateParser.new(templates, @offer)
      header_end = set_header(HEADER_X_COORD, HEADER_Y_COORD, @parser.get_data("header"))
      salary_page = set_letter(header_end, @parser.get_data("letter"))
      set_ta_coord_signature(@letter_end, @parser.get_data("signature"))
      set_applicant_signature(@letter_end, offer)
      if no_office_use_only_box
        set_form(@parser.get_data("office_form"))
      else
        start_new_page
        set_letter(HEADER_X_COORD, @parser.get_data("general_info"))
      end
    end
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
    when SMALL_LEFT_ALIGN
      return {
        font: "Times-Roman",
        font_size: 7,
        text: text,
        align: :justify,
      }
    when SIGNATURE
      return {
        font: get_font("signature"),
        font_size: 25,
        text: text,
        align: :left,
      }
    when INITIAL
      return {
        font: "Times-Roman",
        font_size: 16,
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

  # draws a horizontal according to the fraction of 7.5 inches (because margin
  # for the document is 0.5 inches on all sides)
  def draw_line(grids, length)
    grid(grids[0], grids[1]).bounding_box() do
      stroke_horizontal_line 0, 470*length, at: 5
    end
  end

  # reads forms data, which an array of strings, and extract for a "tablerow"
  # and gets the max number of columns needed in the form table
  def get_table_data(form_data)
    table_data = []
    i = -1
    max = 1
    form_data.each_with_index do |value, index|
      if index!=0
        type_data = @parser.get_type(value)
        if type_data[:type] == "tablerow"
          (table_data[i][:table]).push(type_data[:data])
          if type_data[:data].size > max
            max = type_data[:data].size
          end
        else
          i = i+1
          table_data[i] = {label: value, table: [], index: [index-1, index]}
        end
      end
    end
    return [table_data, max]
  end

  def set_logo(grids)
    logo = "#{Rails.root}/app/assets/images/dcs_logo_blue.jpg"
    grid(grids[0], grids[1]).bounding_box() do
      image logo, at: [0,bounds.height], scale: 0.4
    end
  end

  def set_header(x, y, header_data)
    set_logo(get_grids(x, y-0.1, 1.8, 0.9))

    set_text(get_grids(x+1.8, y-0.1, 3.5, 0.4), get_style(TITLE, header_data[0]))
    set_text(get_grids(x+5.4, y, 1.4, 0.3), get_style(REGULAR_LEFT_ALIGN, header_data[1]))

    set_text(get_grids(x+3.8, y+0.5, 3, 0.5), get_style(TITLE, header_data[2]))

    return y+1
  end

  def set_letter(y, letter_data)
    grids = get_grids(1, y-0.3, 6.5, 9)
    text =[]
    num_lines = 0
    salary_start = 0
    salary_page = 1
    grid(grids[0], grids[1]).bounding_box do
      letter_data.each_with_index do |content, index|
        move_down 10
        num_lines = num_lines +  1
        type_data = @parser.get_type(content)
        if type_data[:type] == "list"
          indent(20) do
            num_lines = set_letter_text(type_data[:data], num_lines)
          end
        elsif type_data[:type] == "salary"
          if !@salary_start
            @salary_start = get_y_by_line(num_lines)-0.6
          end
          salary_page = page_count
          move_down 70
          num_lines = set_letter_text("", num_lines+10)
        else
          num_lines = set_letter_text(content, num_lines)
        end
      end
    end
    if !@letter_end
      @letter_end = get_y_by_line(num_lines)
    end
    return salary_page
  end

  # gets the y coordinate of the paragraph on the page by num_lines
  def get_y_by_line(num_lines)
    if page_count == 1
      return (num_lines*0.16)+0.4
    else
      return ((num_lines - (((page_count-2)*66)+59))*0.16)+0.4
    end
  end

  def set_letter_text(text, num_lines)
    num_lines = num_lines + @parser.get_num_line(text)
    if page_count == 1
      if num_lines > 67
        start_new_page
        move_up 50
      end
    else
      if ((page_count-1)*66)+67< num_lines
        start_new_page
        move_up 50
      end
    end
    text text, inline_format: true, font: "Times-Roman", size: 10, align: :justify
    return num_lines
  end

  def set_ta_coord_signature(y, signature_data)
    if y > 10
      start_new_page
      y = 0.5
    end
    y = y - 0.5
    x = 5
    set_text(get_grids(x, y, 3, 0.2), get_style(REGULAR_LEFT_ALIGN, signature_data[0]))
    set_text(get_grids(x, y+0.15, 3, 0.6), get_style(SIGNATURE, ENV['TA_COORD']))
    set_text(get_grids(x, y+0.6, 3, 0.6), get_style(REGULAR_LEFT_ALIGN, signature_data[1]))
  end

  def set_applicant_signature(y, offer)
    x = HEADER_X_COORD+0.3
    draw_line(get_grids(x, y-0.4, 3, 0.6), 0.4)
    set_text(get_grids(x, y+0.2, 3, 0.6), get_style(SMALL_LEFT_ALIGN, "Applicant Signature".upcase))
    if offer[:signature]
      set_text(get_grids(x, y-0.05, 3, 0.6), get_style(INITIAL, offer[:signature]))
    else
      set_text(get_grids(x, y-0.2, 3, 0.6), get_style(REGULAR_LEFT_ALIGN, "<i>Not Yet Electronically Signed</i>"))
    end
  end

  def set_form(form_data)
    start_new_page
    set_text(get_grids(0.5, HEADER_Y_COORD, 7.5, 0.2), get_style(REGULAR_LEFT_ALIGN, form_data[0]))
    set_form_table(get_grids(0.5, HEADER_Y_COORD+0.15, 7.5, 10), get_table_data(form_data), form_data.size)
    return page_count
  end

  def set_form_table(grids, table_data, rows)
    grid(grids[0], grids[1]).bounding_box do
      define_grid(columns: table_data[1], rows: rows, gutter: 0)
      table_data[0].each do |table|
        set_table_helper(table, table_data[1])
      end
    end
  end

  def set_table_helper(table, num_columns)
    set_text([[table[:index][0], 0],[table[:index][0], num_columns-1]], get_style(REGULAR_LEFT_ALIGN, table[:label]), false, true, 20)
    table[:table].each_with_index do |row, row_num|
      row_multiplier= num_columns/row.length.to_f
      row.each_with_index do |column, index|
        column = column.strip
        curr_row = row_num+table[:index][1]
        horizontal_1 =  index*row_multiplier
        if row_multiplier ==1
          horizontal_2 =  horizontal_1
        else
          horizontal_2 =  (index+1)*row_multiplier-1
        end
        grids = [[curr_row, horizontal_1], [curr_row, horizontal_2]]
        if index%2 == 0
          set_text(grids, get_style(REGULAR_LEFT_ALIGN, "<b>#{column}</b>"), true, true, 12)
        else
          set_text(grids, get_style(REGULAR_LEFT_ALIGN, "#{column}"), true, true)
        end
      end
    end
  end

end
