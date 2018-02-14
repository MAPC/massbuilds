class AddApprovedToEdit < ActiveRecord::Migration[5.1]
  def change
    add_column :edits, :approved, :boolean, default: false
  end
end
