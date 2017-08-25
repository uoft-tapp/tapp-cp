require 'erb'
class TemplateParser

  def initialize(files, offer)
    @offer = offer
    @data = {}
    files.each do |file|
      set_template_data(file)
    end
  end

  def get_data(name)
    return @data[name.to_sym]
  end

  def get_type(text)
    if text[0..5]=="<list>"
      return {type: "list", data: "• #{text[6..text.length-1]}"}
    elsif text[0..7]=="<salary>"
      return {type: "salary"}
    elsif text[0..9]=='<tablerow>'
        return {type: "tablerow", data: text[10..text.length-1].split(":")}
    else
      return {type: "regular", data: text}
    end
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

  private
  def set_template_data(name)
    file_data = File.read("#{Rails.root}/app/services/templates/#{name}.html.erb")
    if file_data
      file_data = file_data.split("\n\n")
      @data[name.to_sym]= file_data.map do |item|
        ERB.new(item).result(binding)
      end
    end
  end

  def format_time(time, form)
    time = time.in_time_zone('Eastern Time (US & Canada)')
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


end
