class AddReviewSignatureToDdah < ActiveRecord::Migration[5.1]
  def change
    add_column :ddahs, :review_supervisor_signature, :string
    add_column :ddahs, :review_ta_coord_signature, :string
    add_column :ddahs, :review_student_signature, :string
  end
end
