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

  desc 'Import previous development data'
  task development_data: :environment do
    csv_text = File.read(Rails.root.join('lib', 'import', 'developments.csv'))
    csv = CSV.parse(csv_text, headers: true, encoding: 'ISO-8859-1')
    csv.each do |row|
      Development.create(
        id: row['id'],
        user_id: row["creator_id"],
        rdv: row["rdv"],
        asofright: row["asofright"],
        ovr55: row["ovr55"],
        clusteros: row["clusteros"],
        phased: row["phased"],
        stalled: row["stalled"],
        name: row["name"],
        status: row["status"],
        desc: row["desc"],
        prj_url: row["project_url"],
        mapc_notes: row["mapc_notes"],
        tagline: row["tagline"],
        address: row["address"],
        state: row["state"],
        zip_code: row["zip_code"],
        height: row["height"],
        stories: row["stories"],
        year_compl: row["year_compl"],
        prjarea: row["prjarea"],
        singfamhu: row["singfamhu"],
        smmultifam: row["twnhsmmult"],
        lgmultifam: row["lgmultifam"],
        hu: row["tothu"],
        yrcomp_est: 0,
        gqpop: row["gqpop"],
        rptdemp: row["rptdemp"],
        emploss: row["emploss"],
        estemp: row["estemp"],
        commsf: row["commsf"],
        hotelrms: row["hotelrms"],
        onsitepark: row["onsitepark"],
        total_cost: row["total_cost"],
        team_membership_count: row["team_membership_count"],
        cancelled: row["cancelled"],
        private: row["private"],
        ret_sqft: row["fa_ret"],
        ofcmd_sqft: row["fa_ofcmd"],
        indmf_sqft: row["fa_indmf"],
        whs_sqft: row["fa_whs"],
        rnd_sqft: row["fa_rnd"],
        ei_sqft: row["fa_edinst"],
        other_sqft: row["fa_other"],
        hotel_sqft: row["fa_hotel"],
        other_rate: row["other_rate"],
        affordable: row["affordable"],
        latitude: row["latitude"],
        longitude: row["longitude"],
        parcel_id: row["parcel_id"],
        mixed_use: row["mixed_use"],
        point: row["point"],
        programs: row["programs"],
        forty_b: row["forty_b"],
        residential: row["residential"],
        commercial: row["commercial"],
        created_at: row["created_at"]
      )
    end
  end

  desc 'Import previous development data'
  task development_municipalities: :environment do
    Development.where(municipality: nil).each do |development|
      municipality = find_municipality(development)
      next if municipality.blank?
      development.update(municipality: municipality[0]['municipal'])
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
end
