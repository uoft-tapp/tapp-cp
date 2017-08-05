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
      @offer[:pay]= 43.65
      @offer[:vac_pay] = 94.28
      define_grid(columns: 75, rows: 100, gutter: 0)
      header_end = set_header(0.7, 0.5, get_template_data("header"))
      letter_end,salary_start, salary_page= set_letter(header_end, get_template_data("letter"))
      signature_end = set_signature(5, letter_end, get_template_data("signature"))
      set_form(signature_end, get_template_data("office_form"))
      set_salary(salary_start, salary_page, get_template_data("salary"))
    end
  end

  private
  def get_template_data(name)
    file_data = File.read("#{Rails.root}/app/services/templates/#{name}.html.erb")
    if file_data
      file_data = file_data.split("\n\n")
      data = file_data.map do |item|
        ERB.new(item).result(binding)
    end
      return data
    else
      return []
    end
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

  def list_instructors(instructors)
    list = ""
    instructors.each_with_index do |instructor, index|
      if index!=0
        if index==instructors.length-1
          list+=" and Professor "
        else
          list+= ", Professor "
        end
      end
      list+=instructor[:name]
    end
    return list
  end

  def set_link(link, text = false)
    if !text
      return "<u><color rgb='#0000ff'><link href='#{link}'>#{link}</link></color></u>"
    else
      return "<u><color rgb='#0000ff'><link href='#{link}'>#{text}</link></color></u>"
    end
  end

  def format_duties(duties)
    return "<list>duties..."
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

  def set_logo(grids)
    logo = "#{Rails.root}/app/assets/images/dcs_logo_blue.jpg"
    grid(grids[0], grids[1]).bounding_box() do
      image logo, at: [0,bounds.height], scale: 0.4
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

  def set_header(x, y, header_data)
    set_logo(get_grids(x, y-0.1, 1.8, 0.9))

    set_text(get_grids(x+1.8, y-0.1, 3.5, 0.4), get_style(1, header_data[0]))
    set_text(get_grids(x+5.4, y, 1.4, 0.3), get_style(4, header_data[1]))

    set_text(get_grids(x+3.8, y+0.5, 3, 0.5), get_style(2, header_data[2]))

    return y+1
  end

  def set_letter(y, letter_data)
    grids = get_grids(1, y-0.3, 6.5, 9)
    text =[]
    num_lines = 0
    salary_start = 0
    salary_page = 1
    grid(grids[0], grids[1]).bounding_box do
      letter_data.each do |content|
        move_down 10
        num_lines = num_lines +  1
        if content[0..5]=="<list>"
          indent(20) do
            num_lines = set_text_box("• #{content[6..content.length-1]}", num_lines)
          end
        elsif content[0..7]=="<salary>"
          salary_start = get_y_by_line(num_lines)-0.6
          salary_page = page_count
          move_down 70
          num_lines = set_text_box("", num_lines+10)
        else
          num_lines = set_text_box(content, num_lines)
        end
      end
    end
    return get_y_by_line(num_lines), salary_start, salary_page
  end

  def get_y_by_line(num_lines)
    if page_count == 1
      return (num_lines*0.16)+0.4
    else
      return ((num_lines - (((page_count-2)*66)+59))*0.16)+0.4
    end
  end

  def set_text_box(text, num_lines)
    num_lines = num_lines + get_num_line(text)
    if page_count == 1
      if num_lines > 59
        start_new_page
        move_up 50
      end
    else
      if ((page_count-1)*66)+59< num_lines
        start_new_page
        move_up 50
      end
    end
    text text, inline_format: true, font: "Times-Roman", size: 10, align: :justify
    return num_lines
  end

  def get_num_line(text)
    words = text.split(/\s/)
    num_lines = text.split("\n").length
    char = 0
    words.each_with_index do |word, index|
      if word.include? '          '
        char=char+7
      end
      word = word.strip
      word = rid_tags(word)
      margin_error =  word.split(/[.,:;l1]/).length
      char=char-(margin_error-1)*0.3
      char, num_lines = parse_word(word, index, char, num_lines)
    end
    return num_lines
  end

  def parse_word(word, index, char, num_lines)
    if index!=0 && word!=''
      char=char+1
    end
    if 105 - (char+word.length)>=0
      char+=word.length
    elsif 105 - (char+word.length)<0
      partible = word.split("-")
      if partible.length == 1
        char=0
        num_lines+=1
      else
        partible.each do |part|
          if 105 - (char+part.length)>=0
            char=char+word.length
          elsif 105 - (char+part.length)<0
            char = 0
            num_lines+=1
          end
        end
      end
    end
    return char, num_lines
  end

  def rid_tags(text)
    regex = ['          ', /<[a-zA\-:.z=\'\/#0-9\s\w]+>/,
      /href='[a-zA-Z0-9.:#\-\/=]+'>/, /<color/, /rgb=\'#0000ff\'><link/]
    regex.each do |reg|
      text = text.gsub(reg, "")
    end
    return text
  end

  def set_signature(x, y, signature_data)
    if y > 9.3
      start_new_page
      y = 0.5
    end
    set_text(get_grids(x, y, 3, 0.2), get_style(3, signature_data[0]))
    set_text(get_grids(x, y+0.1, 3, 0.6), get_style(8, ENV['TA_COORD']))
    set_text(get_grids(x, y+0.6, 3, 0.6), get_style(3, signature_data[1]))
    return y+1.2
  end

  def set_form(y, form_data)
    if y > 9.3
      start_new_page
      y = 0.5
    else
      draw_line(get_grids(1, y-0.1, 7.5, 0.1), 1)
    end
    set_text(get_grids(1, y, 6.5, 0.2), get_style(3, form_data[0]))
    set_form_table(get_grids(1, y+0.15, 6.5, 2.9), get_table_data(form_data), form_data.size-2)
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

  def set_salary(y, page, salary_data)
    go_to_page(page)
    define_grid(columns: 75, rows: 100, gutter: 0)
    grids = get_grids(2.5, y+1.2, 2.5, 1)
    grid(grids[0], grids[1]).bounding_box() do
      data = salary_data[0].split("\n")
      define_grid(columns: 1, rows: data.size+1, gutter: 0)
      set_text([[data.size, 0],[data.size, 0]], get_style(7, salary_data[1]))
      grid([0,0], [2,0]).bounding_box do
        define_grid(columns: 4, rows: data.size, gutter: 0)
        draw_line([[data.size-1, 0], [data.size-1, 3]], 0.39)
        draw_line([[data.size-2, 3], [data.size-2, 3]], 0.1)
        data.each_with_index do |row, index|
          values = row.split(",")
          set_text([[index, 0],[index, 2]], get_style(6, values[0]))
          set_text([[index, 3],[index, 3]], get_style(6, values[1]))
        end
      end
    end
  end

end
