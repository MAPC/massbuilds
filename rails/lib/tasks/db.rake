namespace :db do
  task add_foreign_data_wrapper_interface: :environment do
    ActiveRecord::Base.connection.execute "CREATE EXTENSION IF NOT EXISTS postgres_fdw;"
    ActiveRecord::Base.connection.execute "CREATE SERVER dblive95 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'db.live.mapc.org', port '5433', dbname 'postgis');"
    ActiveRecord::Base.connection.execute "CREATE USER MAPPING FOR #{ActiveRecord::Base.configurations[Rails.env]['username']} SERVER dblive95 OPTIONS (user '#{Rails.application.secrets.foreign_database_username}', password '#{Rails.application.secrets.foreign_database_password}');"
  end

  task delete_foreign_data_wrapper_interface: :environment do
    ActiveRecord::Base.connection.execute "DROP USER MAPPING IF EXISTS FOR #{ActiveRecord::Base.configurations[Rails.env]['username']} SERVER dblive95"
    ActiveRecord::Base.connection.execute "DROP SERVER IF EXISTS dblive95"
    ActiveRecord::Base.connection.execute "DROP EXTENSION IF EXISTS postgres_fdw"
  end

  task add_rpa_fdw: :environment do
    ActiveRecord::Base.connection.execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (rpa_poly) FROM SERVER dblive95 INTO public;"
    # ActiveRecord::Base.connection.add_reference :developments, :rpa_poly, index: true
  end

  task delete_rpa_fdw: :environment do
    ActiveRecord::Base.connection.execute "DROP FOREIGN TABLE IF EXISTS rpa_poly"
    # ActiveRecord::Base.connection.remove_reference :developments, :rpa_poly
  end

  task add_counties_fdw: :environment do
    ActiveRecord::Base.connection.execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (counties_polym) FROM SERVER dblive95 INTO public;"
    # ActiveRecord::Base.connection.add_reference :developments, :counties_polym, index: true
  end

  task delete_counties_fdw: :environment do
    ActiveRecord::Base.connection.execute "DROP FOREIGN TABLE IF EXISTS counties_polym"
    # ActiveRecord::Base.connection.remove_reference :developments, :counties_polym
  end
end

Rake::Task["db:setup"].enhance do
  Rake::Task["db:add_foreign_data_wrapper_interface"].invoke
  Rake::Task["db:add_rpa_fdw"].invoke
  Rake::Task["db:add_counties_fdw"].invoke
end
