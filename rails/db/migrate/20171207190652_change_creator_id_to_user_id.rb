class ChangeCreatorIdToUserId < ActiveRecord::Migration[5.1]
  def change
    rename_column :developments, :creator_id, :user_id
  end
end
