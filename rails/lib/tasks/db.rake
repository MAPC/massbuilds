namespace :db do
  task add_foreign_data_wrapper_interface: :environment do
    ActiveRecord::Base.connection.execute "CREATE EXTENSION IF NOT EXISTS postgres_fdw;"
    ActiveRecord::Base.connection.execute "CREATE SERVER dblive95 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'db.live.mapc.org', port '5433', dbname 'postgis');"
    ActiveRecord::Base.connection.execute "CREATE USER MAPPING FOR CURRENT_USER SERVER dblive95 OPTIONS (user '#{Rails.application.secrets.foreign_database_username}', password '#{Rails.application.secrets.foreign_database_password}');"
  end

  task delete_foreign_data_wrapper_interface: :environment do
    ActiveRecord::Base.connection.execute "DROP USER MAPPING IF EXISTS FOR #{ActiveRecord::Base.configurations[Rails.env]['username']} SERVER dblive95"
    ActiveRecord::Base.connection.execute "DROP SERVER IF EXISTS dblive95"
    ActiveRecord::Base.connection.execute "DROP EXTENSION IF EXISTS postgres_fdw"
  end

  task add_rpa_fdw: :environment do
    ActiveRecord::Base.connection.execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (rpa_poly) FROM SERVER dblive95 INTO public;"
  end

  task add_tod_service_area_poly: :environment do
    ActiveRecord::Base.connection.execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (tod_service_area_poly) FROM SERVER dblive95 INTO public;"
  end

  task add_neighborhoods_poly: :environment do
    ActiveRecord::Base.connection.execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (neighborhoods_poly) FROM SERVER dblive95 INTO public;"
  end

  task delete_rpa_fdw: :environment do
    ActiveRecord::Base.connection.execute "DROP FOREIGN TABLE IF EXISTS rpa_poly"
  end

  task add_counties_fdw: :environment do
    ActiveRecord::Base.connection.execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (counties_polym) FROM SERVER dblive95 INTO public;"
  end

  task delete_counties_fdw: :environment do
    ActiveRecord::Base.connection.execute "DROP FOREIGN TABLE IF EXISTS counties_polym"
  end

  task add_municipalities_fdw: :environment do
    ActiveRecord::Base.connection.execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (ma_municipalities) FROM SERVER dblive95 INTO public;"
  end

  task delete_municipalities_fdw: :environment do
    ActiveRecord::Base.connection.execute "DROP FOREIGN TABLE IF EXISTS ma_municipalities"
  end
end
