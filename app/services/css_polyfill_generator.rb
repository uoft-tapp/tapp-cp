class CssPolyfillGenerator

  def initialize(filename)
    type = tapp_or_cp(filename)
    if type
      lines = get_lines()
      return {
        data: get_polyfill(lines),
        filename: "polyfill.css",
        type: "text/css"
      }
    else
      return nil
    end
  end

  private
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
      lines.push(line)
    end
    file.close
    return lines
  end

  def get_polyfill(lines)
    variables = get_all_variables(lines)
    css = []
    lines.each do |line|
      if contains_variable(line)
        css.push(replace_variable(line, variables))
      else
        css.push(line)
      end
    end
    return css.join("\n")
  end

  def replace_variable(line, variables)
    replacedLine = line
    while contains_variable(replacedLine)
      variables.each do |variable|
        replacedLine = replacedLine.replace("var(#{variable[:key]})", variable[:value])
      end
    end
    return replacedLine
  end

  def contains_variable(line)
    return line.include?("var(--")
  end

  def get_all_variables(lines)
    variables = []
    lines.each do |i|
      variable = get_variable(i.strip)
      if variable
        variables.push(variable)
      end
    end
    return variables
  end

  def get_variable(line)
    if line.length>3
      if line[0..2]=="--"
        parts = line.split(":")
        if parts.size == 2
          return {
            key: parts[0].strip,
            value: parts[1].replace(";", "").strip,
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
