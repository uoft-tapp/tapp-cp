class DdahGenerator
  include Prawn::View
  Prawn::Font::AFM.hide_m17n_warning = true
  TITLE = 1
  REGULAR_LEFT_ALIGN = 2
  REGULAR_CENTER = 3
  SMALL_CENTER = 4
  SIGNATURE = 5
  INITIAL = 6
  HEADER_X_COORD = 0.7
  HEADER_Y_COORD = 0.5

  def initialize(ddah, template = false)
    @ddah = ddah
    @whitespace = Prawn::Text::NBSP * 5
    @tab = Prawn::Text::NBSP * 10
    define_grid(columns: 75, rows: 100, gutter: 0)
    templates = ["ddah_header", "allocations"]
    @parser = TemplateParser.new(templates, @ddah, "ddah")
    set_allocation_table(HEADER_X_COORD, HEADER_Y_COORD+1, @parser.get_data("allocations"))
    start_new_page
    training_end = set_training(HEADER_Y_COORD)
    set_summary(training_end)
    go_to_page(1)
    set_header(HEADER_X_COORD, HEADER_Y_COORD, @parser.get_data("ddah_header"))
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

  def draw_box(grids, shaded = false)
    grid(grids[0], grids[1]).bounding_box() do
      stroke_bounds
      if shaded
        stroke do
          fill_color 'DDDDDD'
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

  # reads forms data, which an array of strings, and extract for a "tablerow"
  # and gets the max number of columns needed in the form table
  def get_table_data(form_data)
    table_data = []
    i = 0
    max = 1
    form_data.each_with_index do |value, index|
      if index!=0
        type_data = @parser.get_type(value)
        if type_data[:type] == "tablerow"
          table_data.push(type_data[:data])
          if type_data[:data].size > max
            max = type_data[:data].size
          end
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
    set_text(get_grids(x, y-0.1, 7.5, 0.4), get_style(TITLE, header_data[0]))
    draw_box(get_grids(0.5, y+0.35, 7.5, 1.1), true)
    set_form_table(get_grids(0.7, y+0.35, 7.5, 1), get_table_data(header_data), header_data.size-1)
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
    column1=[3.7]
    column2=[3.7,4]
    y-=0.2
    set_table_data(start, column2, 1, y, 0.24, [["", "Indicate Tutorial Category (1 primary activity)"]])
    set_table_data(start, column1, 1, y, 0.21, get_checklist(Training, :trainings, 1, 0))
    set_table_data(start, column2, 1, y+0.2, 0.21, get_checklist(Category, :categories, 2, 1))
    return y+1.6
  end

  def get_checklist(model, attr, len, index)
    data = []
    model.all.each do |item|
      if @ddah[attr].include?item[:id]
        val = "[X]"
      else
        val = "[  ]"
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

  def set_form_table(grids, table_data, rows)
    grid(grids[0], grids[1]).bounding_box do
      define_grid(columns: table_data[1], rows: rows, gutter: 0)
      table_data[0].each_with_index do |row, curr_row|
        row_multiplier= row.size/table_data[1].to_f
        row.each_with_index do |cell, index|
          horizontal_1 =  index*row_multiplier
          if row_multiplier ==1
            horizontal_2 =  horizontal_1
          else
            horizontal_2 =  (index+1)*row_multiplier-1
          end
          grids = [[curr_row, horizontal_1], [curr_row, horizontal_2]]
          if index%2 == 0
            set_text(grids, get_style(REGULAR_LEFT_ALIGN, "<b>#{cell}</b>"), false, true)
          else
            set_text(grids, get_style(REGULAR_LEFT_ALIGN, "#{cell}"), false, true)
          end
        end
      end
    end
  end


end
