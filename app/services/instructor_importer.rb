class InstructorImporter
  include Importer

  def import_instructors(data)
    data["instructors"].each do |instructor|
      ident = {utorid: instructor["utorid"]}
      exists = "instructor with utorid #{instructor['utorid']} already exists"
      data = {
        utorid: instructor["utorid"],
        email: instructor["email"],
        name: "#{instructor['first_name']} #{instructor['last_name']}",
      }
      insertion_helper(Instructor, data, ident, exists)
    end
  end

end
