class UpdateDevelopmentSrid < ActiveRecord::Migration[5.1]
  def change
  	execute "SELECT UpdateGeometrySRID('developments', 'point', 4326);"
  end
end
