class AddDeletedAtToEdits < ActiveRecord::Migration[5.1]
  def change
    add_column :edits, :deleted_at, :datetime
    add_index :edits, :deleted_at
  end
end
