# README

## Setup Notes

Before running `bin/setup` you need to set two environment variables: `FOREIGN_DATABASE_USERNAME` and `FOREIGN_DATABASE_PASSWORD` to comport with the username and password of your postgres foreign database.

Before running the test suite you need to enable the foreign data wrapper in the test database:

  RAILS_ENV=test rake db:add_foreign_data_wrapper_interface
  RAILS_ENV=test rake db:add_rpa_fdw
  RAILS_ENV=test rake db:add_counties_fdw
  RAILS_ENV=test rake db:add_municipalities_fdw
