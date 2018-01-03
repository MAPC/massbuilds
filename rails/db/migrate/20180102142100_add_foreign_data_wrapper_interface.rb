class AddForeignDataWrapperInterface < ActiveRecord::Migration[5.1]
  def change
    reversible do |dir|
      dir.up do
        execute "CREATE EXTENSION postgres_fdw;"
        execute "CREATE SERVER dblive95 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'db.live.mapc.org', port '5433', dbname 'postgis');"
        execute "CREATE USER MAPPING FOR #{ActiveRecord::Base.configurations[Rails.env]['username']} SERVER dblive95 OPTIONS (user 'viewer', password '#{Rails.application.secrets.postgis_pass}');"
      end

      dir.down do
        execute "DROP USER MAPPING IF EXISTS FOR #{ActiveRecord::Base.configurations[Rails.env]['username']} SERVER dblive95"
        execute "DROP SERVER IF EXISTS dblive95"
        execute "DROP EXTENSION IF EXISTS postgres_fdw"
      end
    end
  end
end
