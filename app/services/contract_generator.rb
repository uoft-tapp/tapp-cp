require 'erb'
class ContractGenerator
  include Prawn::View

  def initialize(offers)
    offers.each_with_index do |offer, index|
      if index > 0
        start_new_page
      end
      @offer = offer
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
    end
  end

  def get_grids(x, y, width, height)
    x = (x*10)-5
    y = (y*10)-5
    end_x= x+(width*10)-1
    end_y= y+(height*10) -1
    return [[y, x], [end_y, end_x]]
  end

  def set_text(grids, data)
    grid(grids[0], grids[1]).bounding_box() do
      font data[:font]
      font_size data[:font_size]
      text data[:text], inline_format: true, align: data[:align]
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

  def create_form(grids, form_data)
    grid(grids[0], grids[1]).bounding_box() do
      define_grid(columns: 1, rows: 9, gutter: 0)
      form_data.each_with_index do |value, index|
        if index!=0 && index!=9
          grid([index-1,0], [index-1, 0]).bounding_box do
            font_size 9
            text value, inline_format: true
          end
        end
      end
    end
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
    draw_image(get_grids(4.5, 5.9, 3, 0.6))
    set_text(get_grids(4.5, 6.6, 3, 0.2), get_style(3, letter_data[3]))
    draw_line(get_grids(1, 6.8, 6.5, 0.1), 1)
  end

  def set_form(form_data)
    set_text(get_grids(1, 6.9, 6.5, 0.2), get_style(3, form_data[0]))
    set_text(get_grids(1, 10, 6.5, 0.5), get_style(2, form_data[9]))
    create_form(get_grids(1, 7.4, 6.5, 2.9), form_data)
  end

  def set_salary(salary_data)
    define_grid(columns: 75, rows: 100, gutter: 0)
    grids = get_grids(2.5, 3.1, 1.6, 1)
    grid(grids[0], grids[1]).bounding_box() do
      define_grid(columns: 1, rows: 4, gutter: 0)
      set_text([[3, 0],[3, 0]], get_style(7, salary_data[1]))
      grid([0,0], [2,0]).bounding_box do
        define_grid(columns: 4, rows: 3, gutter: 0)
        draw_line([[2, 0], [2, 3]], 0.25)
        draw_line([[1, 3], [1, 3]], 0.065)
        data = salary_data[0].split("\n")
        data.each_with_index do |row, index|
          values = row.split(",")
          set_text([[index, 0],[index, 2]], get_style(6, values[0]))
          set_text([[index, 3],[index, 3]], get_style(6, values[1]))
        end
      end
    end
  end

end
