class AddMunicipalityToDevelopments < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :municipality, :string
  end
end
