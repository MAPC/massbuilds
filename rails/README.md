# MassBuilds (backend)

## Setup Notes

### Postgres
If you haven't already, install PostgreSQL and the postgis extension. On MacOS, you can do this easily with `homebrew`:
```shell
brew install postgresql
brew install postgis
```

Once that's done, you will also need to create a database user for the project, which you can do using the `createdb` command provided by Postgres:
```shell
createuser -s massbuilds
```
Note: the command above will create the `massbuilds` user as a superuser, which is convenient for local development, but not suitable for production.

### Database setup

1. Check Dashlane for the values to use for your `.env` file. Two variables (`FOREIGN_DATABASE_USERNAME` and `FOREIGN_DATABASE_PASSWORD`) are used to fetch certain data sets from `pg.mapc.org` by using the [postgres_fdw extension](https://www.postgresql.org/docs/current/postgres-fdw.html). You will also need to configure your local database credentials:

`POSTGRES_USER`: should be `massbuilds` if you followed the Postgres setup steps above
`POSTGRES_DEV_HOST`: should be `localhost`
`POSTGRES_PASSWORD`: not needed if your user was created following the steps above, but otherwise should be set to the password used during creation of the `massbuilds` database user

2. Run `./bin/setup` to install project dependencies and drop/recreate the local database, then run `bundle exec rake db:migrate` to make sure all DB tables are created

3. To fill development database with an initial set of values, you can get a .dump file and load it in with `pg_restore`. First run `scp massbuilds@prep.mapc.org:/home/massbuilds/massbuilds.dump massbuilds.dump`, then run `pg_restore -a -d massbuilds_development -O -t users -t developments massbuilds.dump`. You may need to run the `pg_restore` command a few times.

4. Run the following to do some data cleanup/regeneration:
```
rake database:refresh_calculated_fields
rake database:fix_seq_id
rake database:populate_long_lat
```

## Local development

After installing dependencies (`bundle install`) and getting the DB set up, you can start rails with `bundle exec rails server`. Follow the steps in the `ember/README.md` to run the front-end.

## Deployment
1. In one terminal window, ssh into either the staging (prep) or production (live) server

2. In another terminal window, run either cap staging deploy or cap production deploy from either the develop or master branch, depending on whether you want to push to live or to staging. *Note: staging deploys from Github's develop branch and production deploys from the master branch. Make sure your work is up-to-date!*

## Troubleshooting

### Debugging ruby/Rails code

To add a breakpoint to the code, you can insert a new line with `binding.pry`. When code execution reaches that step, it will pause and open a debugger in the console. See [https://github.com/pry/pry](https://github.com/pry/pry) for more details on debugging using `pry`.

### Postgres Security Challenges

In order to implement foreign data wrappers your postgres user defined in `database.yml` needs to have proper permissions, or super user privileges. You can achieve this by following the DB setups steps above, or you can grant them to an existing `massbuilds` user with: `ALTER ROLE massbuilds WITH SUPERUSER;`

The foreign database also needs to allow connections via pg_hba.conf in the following manner:

```
ubuntu@ip:/etc/postgresql/9.5/main$ sudo vi pg_hba.conf
ubuntu@i:/etc/postgresql/9.5/main$ sudo pg_ctlcluster 9.5 main restart -m fast
```

### Latitude and Longitude Script
If you run into an error about a development or edit not containing latitude or longitude as a required property, you might need to run `rake database:populate_long_lat` to populate the latitude and longitude fields from the point field.

