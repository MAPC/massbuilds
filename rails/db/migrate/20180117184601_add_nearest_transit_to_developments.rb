class AddNearestTransitToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :n_transit, :string
    add_column :developments, :d_n_trnsit, :string
  end
end
