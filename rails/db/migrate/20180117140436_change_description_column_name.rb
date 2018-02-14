class ChangeDescriptionColumnName < ActiveRecord::Migration[5.1]
  def change
    rename_column :developments, :desc, :descr
  end
end
