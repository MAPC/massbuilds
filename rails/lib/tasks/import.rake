require 'csv'
namespace :import do

  desc 'Perform all import tasks in proper order'
  task in_order: :environment do
    puts 'import:user_data'
    Rake::Task["import:user_data"].invoke

    puts 'import:development_data'
    Rake::Task["import:development_data"].invoke

    puts 'database:fix_seq_id'
    Rake::Task["database:fix_seq_id"].invoke

    puts 'import:developer_name_data'
    Rake::Task["import:developer_name_data"].invoke

    puts 'import:development_municipalities'
    Rake::Task["import:development_municipalities"].invoke
  end

  desc 'Updates the values of a column using the JFMD2018ZF.csv file'
  task :repopulate_column, [:col] => [:environment] do |t, args|
    csv_text = File.read(Rails.root.join('lib', 'import', 'joined_final_massbuilds_data_2018_zip_fixed.csv'))
    csv = CSV.parse(csv_text, headers: true, encoding: 'ISO-8859-1')

    id = 1
    csv.each do |row|
      Development.find(id).update_attribute(args[:col], row[args[:col]])

      id += 1
    end
  end

  desc 'Import previous development data'
  task development_data: :environment do
    csv_text = File.read(Rails.root.join('lib', 'import', 'joined_final_massbuilds_data_2018_zip_fixed.csv'))
    csv = CSV.parse(csv_text, headers: true, encoding: 'ISO-8859-1')

    def to_bool(x)
      return x.to_s.downcase == "true"
    end

    csv.each do |row|
      development = Development.new(
        id: row['project_id'], # in export make sure we use project_id for this
        user_id: row["creator_id"],
        rdv: to_bool(row["rdv"]),
        asofright: to_bool(row["asofright"]),
        ovr55: to_bool(row["ovr55"]),
        clusteros: to_bool(row["clusteros"]),
        phased: to_bool(row["phased"]),
        stalled: to_bool(row["stalled"]),
        name: row["name"],
        status: row["status"],
        descr: row["descr"],
        prj_url: row["prj_url"],
        address: row["address"],
        state: row["state"],
        zip_code: row["zip_code"],
        height: row["height"],
        stories: row["stories"],
        year_compl: row["year_compl"],
        prjarea: row["prjarea"],
        singfamhu: row["singfamhu"],
        smmultifam: row["smmultifam"],
        lgmultifam: row["lgmultifam"],
        hu: row["hu"],
        yrcomp_est: to_bool(row["yrcomp_est"]),
        gqpop: row["gqpop"],
        rptdemp: row["rptdemp"],
        estemp: row["estemp"],
        commsf: row["commsf"],
        hotelrms: row["hotelrms"],
        onsitepark: row["onsitepark"],
        total_cost: row["total_cost"],
        ret_sqft: row["ret_sqft"],
        ofcmd_sqft: row["ofcmd_sqft"],
        indmf_sqft: row["indmf_sqft"],
        whs_sqft: row["whs_sqft"],
        rnd_sqft: row["rnd_sqft"],
        ei_sqft: row["ei_sqft"],
        other_sqft: row["other_sqft"],
        hotel_sqft: row["hotel_sqft"],
        other_rate: row["other_rate"],
        affordable: row["affordable"],
        latitude: row["latitude"],
        longitude: row["longitude"],
        parcel_id: row["parcel_id"],
        mixed_use: to_bool(row["mixed_use"]),
        programs: row["programs"],
        forty_b: row["forty_b"],
        residential: row["residential"],
        commercial: row["commercial"],
        created_at: row["created_at"],
        municipal: row["municipal"],
        units_1bd: row["units_1bd"],
        units_2bd: row["units_2bd"],
        units_3bd: row["units_3bd"],
        affrd_unit: row["affrd_unit"],
        aff_u30: row["aff_u30"],
        aff_30_50: row["aff_30_50"],
        aff_50_80: row["aff_50_80"],
        aff_80p: row["aff_80p"],
        headqtrs: to_bool(row["headqtrs"]),
        park_type: row["park_type"],
        publicsqft: row["publicsqft"],
        devlper: row["devlper"],
        loc_id: row["loc_id"],
        parcel_fy: row["parcel_fy"],
        # n_transit: [row.try(:[], 'n_transit')],
        d_n_trnsit: row["d_n_trnsit"],
        updated_at: row["updated_at"],
        point: convert_srid(row["geom"])
      )
      development.save(validate: false)
    end
  end

  desc 'Import previous development data'
  task development_municipalities: :environment do
    Development.where(municipal: nil).each do |development|
      municipal = find_municipality(development)
      next if municipal.blank?
      development.update(municipal: municipality[0]['municipal'])
    end
  end

  desc 'Import previous user data'
  task user_data: :environment do
    csv_text = File.read(Rails.root.join('lib', 'import', 'users.csv'))
    csv = CSV.parse(csv_text, headers: true, encoding: 'ISO-8859-1')
    csv.each do |row|
      user = User.create!(
        id: row['id'],
        email: row['email'],
        password: 'temporary_password',
        sign_in_count: row['sign_in_count'],
        created_at: row['created_at'],
        first_name: row['first_name'],
        last_name: row['last_name']
        )
      user.update_attribute(:encrypted_password, row['encrypted_password'])
    end
  end

  desc 'Import developer names'
  task developer_name_data: :environment do
    # SELECT development_id, organizations.name
    # FROM development_team_memberships
    # INNER JOIN organizations
    # ON development_team_memberships.organization_id = organizations.id;
    csv_text = File.read(Rails.root.join('lib', 'import', 'developer_names.csv'))
    csv = CSV.parse(csv_text, headers: true, encoding: 'ISO-8859-1')
    csv.each do |row|
      Development.find(row['development_id']).update(devlper: row['name'])
    end
  end

  private

  def find_municipality(development)
    municipality_query = <<~SQL
      SELECT municipal
      FROM
        (SELECT municipal, ST_TRANSFORM(ma_municipalities.geom, 4326) as geom FROM ma_municipalities) municipality,
        (SELECT id, name, point FROM developments) development
        WHERE ST_Intersects(development.point, municipality.geom)
        AND id = #{development.id};
    SQL
    ActiveRecord::Base.connection.exec_query(municipality_query).to_hash
  end

  def convert_srid(point)
    return nil if point.match(/POINT\(\d+\.\d+\s\d+\.\d+\)/).to_s.blank?
    conversion_query = <<~SQL
      SELECT ST_AsText(ST_Transform(ST_GeomFromText('#{point.match(/POINT\(\d+\.\d+\s\d+\.\d+\)/).to_s}',26986),4326)) As wgs_geom;
    SQL
    ActiveRecord::Base.connection.exec_query(conversion_query).to_hash[0]["wgs_geom"]
  end
end
