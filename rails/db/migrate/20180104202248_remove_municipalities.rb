class RemoveMunicipalities < ActiveRecord::Migration[5.1]
  def change
    drop_table :ma_municipalities
  end
end
