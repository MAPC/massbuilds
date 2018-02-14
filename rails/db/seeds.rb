# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# sh "shp2pgsql -I -a -s 26986 #{Rails.root.join('lib', 'import', 'ma_municipalities.shp')} ma_municipalities | psql -d #{Rails.configuration.database_configuration[Rails.env]["database"]}"
