class AddParcelFyToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :parcel_fy, :integer
  end
end
