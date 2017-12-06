class CreateEdits < ActiveRecord::Migration[5.1]
  def change
    create_table :edits do |t|
      t.references :user, foreign_key: true
      t.references :development, foreign_key: true
      t.json :proposed_changes

      t.timestamps
    end
  end
end
