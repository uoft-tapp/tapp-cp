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
      @assignments = assignments_from_session(session[:id])
      @applicants = applicants_from_session(session[:id])
    else
      return {generated: false,  msg: "Error: Invalid Session id."}
    end
  end

  def assignments_from_session(session, utorid = nil)
    if !utorid
      session_select = "SELECT p.id id FROM positions p WHERE p.session_id=#{session}"
      sql="SELECT DISTINCT a.id FROM assignments a, (#{session_select}) p WHERE p.id=a.position_id ORDER BY a.id"
      return get_plain_table_data(Assignment.all.includes([:position, :applicant]), sql)
    else
      positions = positions_from_session(session, utorid)
      sql="SELECT DISTINCT a.id FROM assignments a, (#{positions}) p WHERE p.id=a.position_id ORDER BY a.id"
      return get_plain_table_data(Assignment.all.includes([:position, :applicant]), sql)
    end
  end

  def applicants_from_session(session, utorid = nil)
    if !utorid
      session_select = "SELECT p.id id FROM positions p WHERE p.session_id=#{session}"
      pref_select = "SELECT DISTINCT pref.application_id id FROM preferences pref, (#{session_select}) p WHERE p.id=pref.position_id"
      application_select="SELECT DISTINCT app.applicant_id id FROM applications app, (#{pref_select}) p WHERE p.id=app.id"
      sql="SELECT DISTINCT app.id FROM applicants app, (#{application_select}) p WHERE p.id=app.id ORDER BY app.id"
      return get_plain_table_data(Applicant.all, sql)
    else
      positions = positions_from_session(session, utorid)
      pref_select = "SELECT DISTINCT pref.application_id id FROM preferences pref, (#{positions}) p WHERE p.id=pref.position_id"
      application_select="SELECT DISTINCT app.applicant_id id FROM applications app, (#{pref_select}) p WHERE p.id=app.id"
      sql="SELECT DISTINCT app.id FROM applicants app, (#{application_select}) p WHERE p.id=app.id ORDER BY app.id"
      return get_plain_table_data(Applicant.all, sql)
    end
  end

  def applications_from_session(session, utorid = nil)
    if !utorid
      session_select = "SELECT p.id id FROM positions p WHERE p.session_id=#{session}"
      pref_select = "SELECT DISTINCT pref.application_id id FROM preferences pref, (#{session_select}) p WHERE p.id=pref.position_id"
      sql="SELECT DISTINCT app.id FROM applications app, (#{pref_select}) p WHERE p.id=app.id ORDER BY app.id"
      return get_plain_table_data(Application.all.includes(:preferences), sql)
    else
      positions = positions_from_session(session, utorid)
      pref_select = "SELECT DISTINCT pref.application_id id FROM preferences pref, (#{positions}) p WHERE p.id=pref.position_id"
      sql="SELECT DISTINCT app.id FROM applications app, (#{pref_select}) p WHERE p.id=app.id ORDER BY app.id"
      return get_plain_table_data(Application.all.includes(:preferences), sql)
    end
  end

  def positions_from_session(session = nil, utorid = nil)
    if session
      sql = "SELECT * FROM positions p WHERE p.session_id=#{session} ORDER BY p.id"
      if !utorid
        p "include instructors"
        #return get_plain_table_data(Position.all.includes(:instructors), sql)
        return Position.all.includes(:instructors)
      else
        p "doesn't include instructors"
        instructor_select = "SELECT id FROM instructors WHERE utorid='#{utorid}'"
        instr_position_select = "SELECT a.position_id position_id FROM instructors_positions a, (#{instructor_select}) b WHERE a.instructor_id=b.id"
        return "SELECT a.id id FROM positions a, (#{instr_position_select}) b WHERE a.id=b.position_id"
      end
    else
      sql = "SELECT * FROM positions p ORDER BY p.id"
      return get_plain_table_data(Position.all, sql).format
    end
  end

  def offers_from_session(session)
    offers = []
    Offer.all.each do |offer|
      position = Position.find(offer[:position_id])
      if position[:session_id] == session.to_i
        offers.push(offer)
      end
    end
    return offers
  end

  def ddahs_from_session(session)
    ddahs = []
    Ddah.all.each do |ddah|
      offer = Offer.find(ddah[:offer_id])
      position = Position.find(offer[:position_id])
      if position[:session_id] == session.to_i
        ddahs.push(ddah)
      end
    end
    return ddahs
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

  def position_by_utorid(utorid, session)
  end

end
