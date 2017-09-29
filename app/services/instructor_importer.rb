class InstructorImporter

  def import_instructors(data)
    data["instructors"].each do |instructor|
      ident = {utorid: instructor["utorid"]}
      exists = "instructor with utorid #{instructor['utorid']} already exists"
      data = {
        utorid: instructor["utorid"],
        email: instructor["email"],
        name: "#{instructor['first_name']} #{instructor['last_name']}",
      }
      puts "data: #{data}"
      insertion_helper(Instructor, data, ident, exists)
    end
  end

  private
  def insertion_helper(model, data, ident, exists)
    unless model.where(ident).exists?
      db_model = model.create(data)
      Rails.logger.debug "new #{JSON.pretty_generate(db_model.as_json)}\n\n"
      db_model.save!
      return db_model
    else
      Rails.logger.debug "#{exists}"
      db_model = model.find_by(ident)
      Rails.logger.debug "existing model #{JSON.pretty_generate(db_model.as_json)}\n"
      db_model.update_attributes(data)
      Rails.logger.debug "update model #{exists}\nupdate to #{JSON.pretty_generate(db_model.as_json)}\n\n"
      db_model.save!
      return db_model
    end
  end

end
