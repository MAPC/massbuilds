class ChangeAffordableUnitsUnknownTypeColumnName < ActiveRecord::Migration[5.1]
  def change
    rename_column :developments, :affUnknown, :aff_unknown
  end
end
