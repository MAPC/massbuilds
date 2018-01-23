class UpdateAttributeNames < ActiveRecord::Migration[5.1]
  def change
    rename_column :developments, :ma_municipalities_id, :muni_id
    rename_column :developments, :municipality, :municipal
  end
end
