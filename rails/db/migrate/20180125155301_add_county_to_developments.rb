class AddCountyToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :county, :string
    remove_column :developments, :counties_polym_id if ActiveRecord::Base.connection.column_exists? :developments, :counties_polym_id
  end
end
