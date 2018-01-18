class AddLocIdToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :loc_id, :string
  end
end
