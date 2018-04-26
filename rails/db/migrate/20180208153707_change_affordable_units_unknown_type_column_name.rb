class ChangeAffordableUnitsUnknownTypeColumnName < ActiveRecord::Migration[5.1]
  def change
    rename_column :developments, :affUnknown, :aff_unknown if ActiveRecord::Base.connection.column_exists? :developments, :affUnknown
  end
end
