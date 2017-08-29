class AddDatesToPosition < ActiveRecord::Migration[5.1]
  def change
    add_column :positions, :start_date, :datetime
    add_column :positions, :end_date, :datetime

    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE positions
          SET start_date=sessions.start_date, end_date=sessions.end_date
          FROM sessions
          WHERE positions.session_id=sessions.id;
        SQL
      end

      dir.down do
        execute <<-SQL
          UPDATE positions
          SET start_date=sessions.start_date, end_date=sessions.end_date 
          FROM sessions
          WHERE positions.session_id=sessions.id;
        SQL
      end
    end


    remove_column :sessions, :start_date, :datetime
    remove_column :sessions, :end_date, :datetime
  end
end
