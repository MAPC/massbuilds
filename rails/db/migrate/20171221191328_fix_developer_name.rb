class FixDeveloperName < ActiveRecord::Migration[5.1]
  def change
    remove_column :developments, :devlper
    rename_column :developments, :developer_name, :devlper
  end
end
