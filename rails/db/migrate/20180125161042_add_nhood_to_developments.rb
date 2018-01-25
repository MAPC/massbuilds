class AddNhoodToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :nhood, :string
  end
end
