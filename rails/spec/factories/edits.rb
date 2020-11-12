# frozen_string_literal: true
FactoryBot.define do
  factory :edit do
    user
    proposed_changes do
      { name: 'Test Development',
        hotelrms: 2,
        year_compl: 1987,
        yrcomp_est: false,
        status: 'projected',
        address: '23 Banks St',
        zip_code: '02138',
        point: 'POINT(-71.3940804 42.1845218)',
        latitude: 42.1845218,
        longitude: -71.3940804,
        descr: 'A sample edited development',
        hu: 1,
        commsf: 25,
        rdv: true,
        asofright: false,
        clusteros: false,
        phased: false,
        stalled: false,
        mixed_use: true,
        headqtrs: false,
        ovr55: false }
    end
    approved { false }
  end
end
