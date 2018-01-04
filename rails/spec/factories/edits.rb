FactoryBot.define do
  factory :edit do
    user
    proposed_changes { { name: 'Test Development',
                         tagline: 'new tagline',
                         hotelrms: 2,
                         year_compl: 1987,
                         yrcomp_est: "1987",
                         status: 'projected',
                         address: '23 Banks St',
                         zip_code: '02138',
                         point: 'POINT(-71.3940804 42.1845218)',
                         hu: 1,
                         commsf: 25,
                         desc: 'A sample edited development',
                         rdv: true,
                         asofright: false,
                         clusteros: false,
                         phased: false,
                         stalled: false,
                         mixed_use: true,
                         headqtrs: false,
                         ovr55: false
                     } }
  end
end
