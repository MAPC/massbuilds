namespace :database do

  desc 'Fix Postgres ID sequences'
  task fix_seq_id: :environment do
    ActiveRecord::Base.connection.tables.each do |t|
      ActiveRecord::Base.connection.reset_pk_sequence!(t)
    end
  end

  desc 'Refresh calculated fields'
  task refresh_calculated_fields: :environment do
    ActiveRecord::Base.connection.exec_query 'VACUUM ANALYZE parcels;'
    Development.update_all(rpa_name: nil)
    Development.update_all(county: nil)
    Development.update_all(municipal: nil)
    Development.update_all(n_transit: nil)
    Development.update_all(nhood: nil)
    Development.update_all(loc_id: nil)

    Parallel.each(Development.all, in_threads: 3) do |development|
      ActiveRecord::Base.connection_pool.with_connection do
        development.run_callbacks(:save)
        print '.'
      end
    end
  end

end
