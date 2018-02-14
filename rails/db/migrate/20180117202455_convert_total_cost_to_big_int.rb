class ConvertTotalCostToBigInt < ActiveRecord::Migration[5.1]
  def change
    change_column :developments, :total_cost, :bigint
  end
end
