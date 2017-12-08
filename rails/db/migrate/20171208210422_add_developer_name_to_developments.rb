class AddDeveloperNameToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :developer_name, :string
  end
end
