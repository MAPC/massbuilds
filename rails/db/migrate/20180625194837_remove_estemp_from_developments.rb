class RemoveEstempFromDevelopments < ActiveRecord::Migration[5.1]
  def change
    remove_column :developments, :estemp
  end
end
