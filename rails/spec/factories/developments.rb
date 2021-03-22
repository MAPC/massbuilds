# frozen_string_literal: true
FactoryBot.define do
  factory :development do
    rdv { false }
    asofright { false }
    ovr55 { false }
    clusteros { false }
    phased { false }
    stalled { false }
    name { 'Seaport' }
    status { 'MyString' }
    descr { 'A sample development' }
    prj_url { 'http://www.example.com/' }
    address { '123 Main Street' }
    state { 'MA' }
    zip_code { '02138' }
    height { 1 }
    stories { 1 }
    year_compl { 1 }
    prjarea { 1 }
    singfamhu { 1 }
    smmultifam { 1 }
    lgmultifam { 1 }
    hu { 1 }
    gqpop { 1 }
    rptdemp { 1 }
    commsf { 1 }
    hotelrms { 1 }
    onsitepark { 1 }
    total_cost { 1 }
    ret_sqft { 1.5 }
    ofcmd_sqft { 1.5 }
    indmf_sqft { 1.5 }
    whs_sqft { 1.5 }
    rnd_sqft { 1.5 }
    ei_sqft { 1.5 }
    other_sqft { 1.5 }
    hotel_sqft { 1.5 }
    other_rate { 1.5 }
    affordable { 1.5 }
    parcel_id { 'MyString' }
    mixed_use { false }
    point { 'POINT(-71.0589 42.3601)' }
    latitude { 42.3601 }
    longitude { -71.0589 }
    programs { 'MyString' }
    forty_b { false }
    residential { false }
    commercial { false }
    municipal { 'Boston' }
    devlper { 'Gilbane' }
    units_1bd { 1 }
    units_2bd { 1 }
    units_3bd { 1 }
    affrd_unit { false }
    aff_u30 { 1 }
    aff_30_50 { 1 }
    aff_50_80 { 1 }
    aff_80p { 1 }
    headqtrs { false }
    park_type { 'parking' }
    publicsqft { 1 }
    yrcomp_est { '2010' }
    mepa_id { 12345 }
    traffic_count_data { 'https://mobility-massdot.hub.arcgis.com' }
  end
end
