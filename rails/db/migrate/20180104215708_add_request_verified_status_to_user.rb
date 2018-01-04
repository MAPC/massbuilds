class AddRequestVerifiedStatusToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :request_verified_status, :boolean, default: false
  end
end
