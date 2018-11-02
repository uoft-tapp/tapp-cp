module SessionSeparate
  def execute_sql(sql)
    results = ActiveRecord::Base.connection.execute("#{sql};")
    if results.present?
      return JSON.parse(results.to_json, symbolize_names: true)
    else
      return nil
    end
  end

  def session_check(session_id)
    session = Session.find(session_id)
    if session
      @assignments = assignments_from_session(session[:id], nil, @assignments)
      @applicants = applicants_from_session(session[:id], nil, @applicants)
    else
      return {generated: false,  msg: "Error: Invalid Session id."}
    end
  end

  def assignments_from_session(session, utorid = nil, table = nil)
    positions = positions_from_session(session, utorid, false)
    sql="SELECT DISTINCT a.id FROM assignments a, (#{positions}) p WHERE p.id=a.position_id"
    return get_plain_table_data(table ? table : Assignment.all.includes([:position, :applicant]), sql)
  end

  def applicants_from_session(session, utorid = nil, table = nil)
    applications = applications_from_session(session, utorid, false)
    sql="SELECT DISTINCT app.id FROM applicants app, (#{applications}) p WHERE p.id=app.id"
    return get_plain_table_data(table ? table : Applicant.all, sql)
  end

  def applications_from_session(session, utorid = nil, data=true)
    positions = positions_from_session(session, utorid, false)
    pref_select = "SELECT DISTINCT pref.application_id id FROM preferences pref, (#{positions}) p WHERE p.id=pref.position_id"
    sql="SELECT DISTINCT app.id FROM applications app, (#{pref_select}) p WHERE p.id=app.id"
    return data ? get_plain_table_data(Application.all.includes(:preferences), sql) : sql
  end

  def positions_from_session(session = nil, utorid = nil, data=true)
    positions = utorid ? Position.all : Position.all.includes(:instructors)
    if utorid
      instructor_select = "SELECT id FROM instructors WHERE utorid='#{utorid}'"
      instr_position_select = "SELECT a.position_id position_id FROM instructors_positions a, (#{instructor_select}) b WHERE a.instructor_id=b.id"
      sql = "SELECT a.id id FROM positions a, (#{instr_position_select}) b WHERE a.id=b.position_id"
      sql = session ? "#{sql} AND a.session_id=#{session}" : sql
      puts sql
      return data ? get_plain_table_data(positions, sql) : sql
    else
      sql = "SELECT a.id id FROM positions a"
      sql = session ? "#{sql} WHERE a.session_id=#{session}" : sql
      puts sql
      return data ? (!session ? positions : get_plain_table_data(positions, sql)) : sql
    end
  end

  def offers_from_session(session, utorid, data = true)
    positions = positions_from_session(session, utorid, false)
    sql = "SELECT a.id id FROM offers a, (#{positions}) b WHERE a.position_id=b.id"
    return data ? get_plain_table_data(Offer.all, sql) : sql
  end

  def ddahs_from_session(session, utorid)
    offers = offers_from_session(session, utorid, false)
    sql = "SELECT a.id id FROM ddahs a, (#{offers}) b WHERE a.offer_id=b.id"
    return get_plain_table_data(Ddah.all, sql)
  end

  private
  def get_plain_table_data(table, sql)
    data = []
    ids = get_id_array(sql)
    table.each do |item|
      if ids.include? item[:id]
        data.push(item)
      end
    end
    return data
  end

  def get_id_array(sql)
    execute_sql(sql).map do |item|
      item[:id]
    end
  end

end
