class CssPolyfillGenerator

  def polyfill_css(filename)
    file_data = tapp_or_cp(filename)
    if file_data
      lines = get_lines(file_data)
      return set_data_type(get_polyfill(lines))
    else
      return set_data_type(file_data.join("\n"))
    end
  end

  private
  def set_data_type(data)
    return {
      data: data,
      filename: "polyfill.css",
      type: "text/css"
    }
  end
  def tapp_or_cp(filename)
    if filename.include?("tapp")
      return "tapp"
    elsif filename.include?("cp")
      return "cp"
    else
      return nil
    end
  end

  def get_lines(filename)
    file = File.new("#{Rails.root}/app/assets/stylesheets/#{filename}.css", "r")
    lines = []
    while (line = file.gets)
      tmp =line.sub("\n", "")
      lines.push(tmp)
    end
    file.close
    return lines
  end

  def get_polyfill(lines)
    all_variables(lines)
    css = []
    lines.each do |line|
      if contains_variable(line)
        css.push(replace_variable(line))
      else
        css.push(line)
      end
    end
    return css.join("\n")
  end

  def replace_variable(line)
    replacedLine = line
    @variables.each do |variable|
      replacedLine = replacedLine.gsub("var(#{variable[:key]})", variable[:value])
    end
    return replacedLine
  end

  def contains_variable(line)
    return line.include?("var(--")
  end

  def all_variables(lines)
    @variables = []
    lines.each do |line|
      variable = get_variable(line.strip)
      if variable
        @variables.push(variable)
      end
    end
  end

  def get_variable(line)
    if line.length>3
      if line[0..1]=="--"
        parts = line.split(":")
        if parts.size == 2
          value = parts[1].split(";")[0].strip
          if contains_variable(value)
            value = replace_variable(value)
          end
          return {
            key: parts[0].strip,
            value: value,
          }
        else
          return nil
        end
      else
        return nil
      end
    else
      return nil
    end
  end

end
