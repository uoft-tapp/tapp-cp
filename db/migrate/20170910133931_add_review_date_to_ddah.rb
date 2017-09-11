class AddReviewDateToDdah < ActiveRecord::Migration[5.1]
  def change
    add_column :ddahs, :review_date, :date
  end
end
