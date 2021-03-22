class AddFieldsToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :mepa_id, :integer
    add_column :developments, :traffic_count_data, :string
  end
end
