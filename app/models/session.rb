class Session < ApplicationRecord
  has_many :positions
  include Model

  def format
    session = self.json
    map = {}
    Position.all.each do |position|
      if map[position[:session_id]]
        if !map[position[:session_id]].include?(position[:round_id].to_i)
          map[position[:session_id]].push(position[:round_id].to_i)
        end
      else
        map[position[:session_id]] = []
      end
    end
    session[:rounds] = map[session[:id]]
    return session
  end
end
