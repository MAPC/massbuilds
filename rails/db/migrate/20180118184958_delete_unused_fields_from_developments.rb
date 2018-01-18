class DeleteUnusedFieldsFromDevelopments < ActiveRecord::Migration[5.1]
  def change
    remove_column :developments, :mapc_notes
    remove_column :developments, :tagline
    remove_column :developments, :emploss
    remove_column :developments, :team_membership_count
    remove_column :developments, :cancelled
    remove_column :developments, :private
  end
end
