class CreateInstructorsPositions < ActiveRecord::Migration[5.1]
  def change
    create_table :instructors_positions, id: false do |t|
      t.belongs_to :instructor, index: true
      t.belongs_to :position, index: true
    end
  end
end
