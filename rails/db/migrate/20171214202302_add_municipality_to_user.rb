class AddMunicipalityToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :municipality, :string
  end
end
