class RemoveMuniIdFromDevelopments < ActiveRecord::Migration[5.1]
  def change
    remove_column :developments, :muni_id if ActiveRecord::Base.connection.column_exists? :developments, :muni_id
  end
end
