module Model
  def json
    JSON.parse(self.to_json, symbolize_names: true)
  end
end
