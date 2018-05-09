class UpdateAttributeNames < ActiveRecord::Migration[5.1]
  def change
    rename_column :developments, :ma_municipalities_id, :muni_id if ActiveRecord::Base.connection.column_exists? :developments, :ma_municipalities_id
    rename_column :developments, :municipality, :municipal
  end
end
