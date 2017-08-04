require 'erb'
class ContractGenerator
  include Prawn::View

  def initialize(offers)
    offers.each_with_index do |offer, index|
      if index > 0
        start_new_page
      end
      @offer = offer
      @whitespace = Prawn::Text::NBSP * 5
      @tab = Prawn::Text::NBSP * 10
      @offer[:UG_pay]= 43.65
      @offer[:SGS_pay]= 43.65
      define_grid(columns: 75, rows: 100, gutter: 0)
      set_header(get_template_data("header"))
      set_letter(get_template_data("letter"))
      set_form(get_template_data("office_form"))
      set_salary(get_template_data("salary"))
    end
  end

  private
  def get_template_data(name)
    file_data = File.read("#{Rails.root}/app/services/templates/#{name}.html.erb").split("\n\n")
    data = file_data.map do |item|
      ERB.new(item).result(binding)
    end
    return data
  end

  def get_font(name)
    return "#{Rails.root}/app/services/templates/fonts/#{name}.ttf"
  end

  def format_time(time, form)
    time = (Date.parse time).in_time_zone('Eastern Time (US & Canada)')
    case form
    when 1
      return time.strftime("%B %e, %Y")
    when 2
      return time.strftime("%d.%m.%Y")
    end
  end

  def get_style(type, text)
    case type
    when 1
      return {
        font: get_font("cmcsc10"),
        font_size: 16,
        text: text,
        align: :center,
      }
    when 2
      return {
        font: "Times-Roman",
        font_size: 12,
        text: text,
        align: :center,
      }
    when 3
      return {
        font: "Times-Roman",
        font_size: 9,
        text: text,
        align: :left,
      }
    when 4
      return {
        font: "Times-Roman",
        font_size: 9,
        text: text,
        align: :center,
      }
    when 5
      return {
        font: get_font("cmcsc10"),
        font_size: 7.4,
        text: text,
        align: :center,
      }
    when 6
      return {
        font: "Times-Roman",
        font_size: 9,
        text: text,
        align: :justify,
      }
    when 7
      return {
        font: "Times-Roman",
        font_size: 7,
        text: text,
        align: :justify,
      }
    when 8
      return {
        font: get_font("signature"),
        font_size: 25,
        text: text,
        align: :left,
      }
    end
  end

  def get_grids(x, y, width, height)
    x = (x*10)-5
    y = (y*10)-5
    end_x= x+(width*10)-1
    end_y= y+(height*10) -1
    return [[y, x], [end_y, end_x]]
  end

  def set_text(grids, data, fill = false, top_padding = false)
    grid(grids[0], grids[1]).bounding_box() do
      font data[:font]
      font_size data[:font_size]
      if top_padding
        move_down 3
      end
      if fill
        stroke_bounds
        text "#{Prawn::Text::NBSP * 3}#{data[:text]}", inline_format: true, align: data[:align]
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

  def draw_line(grids, length)
    grid(grids[0], grids[1]).bounding_box() do
      stroke_horizontal_line 0, 470*length, at: 5
    end
  end

  def draw_image(grids)
    grid(grids[0], grids[1]).bounding_box() do
      stroke_bounds
    end
  end

  def get_table_data(form_data)
    table_data = []
    i = -1
    max = 1
    form_data.each_with_index do |value, index|
      if index!=0 && index!=form_data.size-1
        if value[0..1]=='\t'
          data = value[2..(value.length-1)].split(":")
          (table_data[i][:table]).push(data)
          if data.size > max
            max = data.size
          end
        else
          i = i+1
          table_data[i] = {label: value, table: [], index: [index-1, index]}
        end
      end
    end
    return [table_data, max]
  end

  def set_header(header_data)
    draw_image(get_grids(0.7, 0.4, 1.8, 0.9))
    set_text(get_grids(0.7, 1.3, 1.8, 0.3), get_style(5, header_data[0]))

    set_text(get_grids(2.5, 0.4, 3.5, 0.4), get_style(1, header_data[1]))
    set_text(get_grids(6.1, 0.5, 1.4, 0.3), get_style(4, header_data[2]))

    set_text(get_grids(4.5, 1.2, 3, 0.5), get_style(2, header_data[3]))
  end

  def set_letter(letter_data)
    set_text(get_grids(1, 1.9, 6.5, 1.3), get_style(6, letter_data[0]))
    set_text(get_grids(1, 4.2, 6.5, 1.7), get_style(6, letter_data[1]))

    set_text(get_grids(4.5, 5.8, 3, 0.2), get_style(3, letter_data[2]))

    set_text(get_grids(4.5, 5.9, 3, 0.6), get_style(8, ENV['TA_COORD']))

    set_text(get_grids(4.5, 6.4, 3, 0.2), get_style(3, letter_data[3]))
    draw_line(get_grids(1, 6.8, 6.5, 0.1), 1)
  end

  def set_form(form_data)
    set_text(get_grids(1, 6.9, 6.5, 0.2), get_style(3, form_data[0]))
    set_text(get_grids(1, 10, 6.5, 0.5), get_style(2, form_data[form_data.size-1]))
    set_form_table(get_grids(1, 7.05, 6.5, 2.9), get_table_data(form_data), form_data.size-2)
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
    set_text([[table[:index][0], 0],[table[:index][0], num_columns-1]], get_style(7, table[:label]), false, true)
    table[:table].each_with_index do |row, row_num|
      row_multiplier= num_columns/row.length.to_f
      row.each_with_index do |column, index|
        column = column.strip
        curr_row = row_num+table[:index][1]
        horizontal_1 =  index*row_multiplier
        if index == row.length-1 && row_multiplier ==1
          horizontal_2 =  horizontal_1
        else
          horizontal_2 =  (index+1)*row_multiplier-1
        end
        grids = [[curr_row, horizontal_1], [curr_row, horizontal_2]]
        if index%2 == 0
          set_text(grids, get_style(7, "<b>#{column}</b>"), true, true)
        else
          set_text(grids, get_style(7, "#{column}"), true, true)
        end
      end
    end
  end

  def set_salary(salary_data)
    define_grid(columns: 75, rows: 100, gutter: 0)
    grids = get_grids(2.5, 3.1, 1.6, 1)
    grid(grids[0], grids[1]).bounding_box() do
      data = salary_data[0].split("\n")
      define_grid(columns: 1, rows: data.size+1, gutter: 0)
      set_text([[data.size, 0],[data.size, 0]], get_style(7, salary_data[1]))
      grid([0,0], [2,0]).bounding_box do
        define_grid(columns: 4, rows: data.size, gutter: 0)
        draw_line([[data.size-1, 0], [data.size-1, 3]], 0.25)
        draw_line([[data.size-2, 3], [data.size-2, 3]], 0.065)
        data.each_with_index do |row, index|
          values = row.split(",")
          set_text([[index, 0],[index, 2]], get_style(6, values[0]))
          set_text([[index, 3],[index, 3]], get_style(6, values[1]))
        end
      end
    end
  end

end
