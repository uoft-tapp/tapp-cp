module Model
  def json
    JSON.parse(self.to_json, symbolize_names: true)
  end

  def id_array(models)
    models.map do |model|
      model[:id]
    end
  end

end
