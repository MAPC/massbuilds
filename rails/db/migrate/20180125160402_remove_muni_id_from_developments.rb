class RemoveMuniIdFromDevelopments < ActiveRecord::Migration[5.1]
  def change
    remove_column :developments, :muni_id
  end
end
