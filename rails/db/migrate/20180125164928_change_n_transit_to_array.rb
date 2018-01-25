class ChangeNTransitToArray < ActiveRecord::Migration[5.1]
  def change
    remove_column :developments, :n_transit
    add_column :developments, :n_transit, :text, array: true, default: []
  end
end
