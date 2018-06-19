class RemoveMunicipalities < ActiveRecord::Migration[5.1]
  def change
    drop_table 'ma_municipalities' if ActiveRecord::Base.connection.table_exists? 'ma_municipalities'
  end
end
