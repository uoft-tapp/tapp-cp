class AddFullTimeToApplicants < ActiveRecord::Migration[5.1]
  def change
    add_column :applicants, :full_time, :string
  end
end
