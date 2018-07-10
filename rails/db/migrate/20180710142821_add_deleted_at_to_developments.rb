class AddDeletedAtToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :deleted_at, :datetime
    add_index :developments, :deleted_at
  end
end
