class AddUnknownTypesToCompositeDevelopmentAttrs < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :unknownhu, :integer
    add_column :developments, :affUnknown, :integer
    add_column :developments, :unk_sqft, :integer
  end
end
