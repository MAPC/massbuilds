class ConvertCreatorIdToUserAssociation < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :developments, :users, column: :creator_id, primary_key: "id"
  end
end
