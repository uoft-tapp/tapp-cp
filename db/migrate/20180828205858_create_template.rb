class CreateTemplate < ActiveRecord::Migration[5.1]
  def change
    create_table :templates do |t|
      t.references :position, foreign_key: true
    end
  end
end
