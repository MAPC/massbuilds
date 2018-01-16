# README

## Setup Notes

Before running `bin/setup` you need to set two environment variables: `FOREIGN_DATABASE_USERNAME` and `FOREIGN_DATABASE_PASSWORD` to comport with the username and password of your postgres foreign database.

Before running the test suite you need to enable the foreign data wrapper in the test database:

  RAILS_ENV=test rake db:add_foreign_data_wrapper_interface
  RAILS_ENV=test rake db:add_rpa_fdw
  RAILS_ENV=test rake db:add_counties_fdw
  RAILS_ENV=test rake db:add_municipalities_fdw

### Postgres Security Challenges

In order to implement foreign data wrappers your postgres user defined in `database.yml` needs to have super user privileges or it will fail. You can do this with: `ALTER ROLE massbuilds WITH SUPERUSER;`

The foreign database also needs to allow connections via pg_hba.conf in the following manner:

```
ubuntu@ip:/etc/postgresql/9.5/main$ sudo vi pg_hba.conf
ubuntu@i:/etc/postgresql/9.5/main$ sudo pg_ctlcluster 9.5 main restart -m fast
```

Also make sure the foreign_database_username and foreign_database_password attributes are set in `secrets.yml`.
