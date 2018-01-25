class AddRpaName < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :rpa_name, :string
    remove_column :developments, :rpa_poly_id
  end
end
