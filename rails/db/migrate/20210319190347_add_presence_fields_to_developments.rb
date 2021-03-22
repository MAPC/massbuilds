class AddPresenceFieldsToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :mepa_id_present, :boolean
    add_column :developments, :traffic_count_data_present, :boolean
  end
end
