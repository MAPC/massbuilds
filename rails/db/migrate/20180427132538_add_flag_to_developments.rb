class AddFlagToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :flag, :boolean
  end
end
