# tapp

[![Build Status](https://travis-ci.org/uoft-tapp/tapp.svg?branch=master)](https://travis-ci.org/uoft-tapp/tapp)

- [updateDeployment](#updateDeployment)
- [initial deployment](#deployment)
- [backup & restore](#backup-restore)
- [Task Commands](#task-commands)

TA assignment and matching application.

## Starting application
You should have a reasonably recent version of Docker
[installed](https://docs.docker.com/engine/installation/). Also, check that
you have docker-compose installed.

Copy the `dev.env.default` file to `.env`.  This file is where the docker components
will pickup environment variables such as the postgres username and password. The environment is essential to have right for both build and execution. We change between production and development by changing the .env file.

```
cp dev.env.default .env #for developers, different command for production
```

Once that's out of the way, clone this repo, navigate into the cloned
directory, and run


```
docker-compose up
```

In a new tab, open http://localhost:3000 to see the Rails welcome page!

`docker-compose up` has launched two containers: `rails-app`
and `webpack-dev-server`. The former runs the Rails app, while the latter
watches and compiles React files located in `app/javascript/packs`.

## Trying things out
The app directory (our application code, most of the files in this repo) is mounted as a `volume` by our `rails-app` container running in development mode. This means that the container running the `rails-app` service sees the app directory and hence can see changes you make locally right away! (Note: this is NOT so when running in the production configuration).

You have full control over Rails code, apply the usual methods. Check the next
section for details on running commands like `rake …` and `rails …`.

To get you started with React quicker, this app comes preloaded with a simple
React app. Visiting http://localhost:3000/hello_react will load JavaScript code
located in `app/javascript/packs/hello_react.jsx`.

## Running commands

Since rails is running in the `rails-app` container the various rails utilities must be run in the container too.
To run any `bundle …`, `rails …`, `rake …`, or `yarn …` commands, you must run them in the container using docker-compose.


`docker-compose run rails-app CMD` tells docker that you want to run the (linux) CMD inside the container running the `rails-app` service.

Hence, to do `rails generate controller Welcome` you need to do
```
docker-compose run rails-app rails generate controller Welcome
```

## Testing
This app comes pre-loaded with a testing framework for the Ruby parts,
[rspec-rails](https://github.com/rspec/rspec-rails). You can run all tests
like so:
```
docker-compose run rails-app rake spec
```
Tests are located in `spec/controllers`, `spec/models`, and `spec/routing`.

A test autorunner, [guard](https://github.com/guard/guard), will watch changes
to your files and run applicable tests automatically. When developing, start
it with
```
docker-compose run rails-app guard
```

## Dependencies
Ruby/Rails and JavaScript dependencies are checked on container start. Any
unmet dependencies will be installed automatically for the current container.

To add a Ruby/Rails dependency, modify `Gemfile` and (re-)start `rails-app`
service, `docker-compose up` or `docker-compose restart rails-app`.

To add a JavaScript dependency, use Yarn:  
```
docker-compose run rails-app yarn add <package-name>
```  
and restart `webpack-dev-server` service.

To add a system dependency, modify the Dockerfile.

## In case of container trouble

If you are okay with losing all the data in the database, you can try `docker-compose down -v`, then `docker-compose up`. This should
delete existing data for this project.

`down -v` deletes all the volumes declared of the compose file. At time of writing, this blows away the files containing the postgress database in the postgress service, but has no effect on the rails service. The fact that it deletes ALL the volumes makes this a dangerous command, potentially disasterous in production.

To recreate the images the containers boot from, give `docker-compose up` the `--force-recreate` command line option like so:

`docker-compose up --force-recreate`

To absolutely nuke all the docker images and networks:

`docker system prune --all --force`


## Initial Deployment <a id="deployment"></a>

* The Dockerfile contains instructions to set up the image of the container (linux, yarn, npm etc)
* The `docker-compose` `yml` files setup the services that your container will be using (postgres, rails).
* The [prod|dev].env.default files are read by docker (at build and runtime) and define variables that parametrize the Dockerfile and the docker-compose files.

### daemon.json

Some of the security offered by docker containers is that docker sets up a private "bridge" network that the containers use to communicate. For instance, in the docker-compose.yml file a `link` stanza allows rails to connect to postgress over this private network. An intruder that penetrates the host cannot see the postgress server even though the rails container can!

The bad news is that to do this Docker has to guess some parameters of this private network, for instance what IP addresses to use. These are set in a file called `daemon.json`

On our network, `tapp.cs.toronto.edu:/etc/cocker/daemon.json` contains:

```
{
 "bip": "192.168.152.1/24"
}
```

This tells docker to use a particular IP range for its bridge network. We had to do this because docker guessed private IP addresses for its bridge that correspond to real workstations on the departmental (private) network. It is essential that the range is reserved by CSLAB admins for docker and not used for any other purpose. (Apparently it's okay for all docker instances to set up their bridge lans this way)

See https://github.com/uoft-tapp/tapp/blob/master/etc/daemon.json

NB. subnet for docker networks that are created at docker-compose up time are configured in prod.env file

### apache (reverse proxy)

Lloyd to type here.

### Initial deployment

On the production machine:

1. Check out the code locally: `git clone git@github.com:uoft-tapp/tapp.git`
2. Copy `prod.env.default` to `.env`, `cp prod.env.default .env`. Visually inspect `.env` to confirm all variables are assigned the right values for the environment! ("right" in this case mostly means make sure the .env file is the production version rather than dev before continuing)
3. Run `docker-compose build rails-app`
4. Run `docker-compose up -d` to launch all services and daemonize the control
5. Run `docker-compose run rails-app rake db:migrate db:seed` to create application database schema and initial data

If you don't specify the environment variable that the docker-compose file should reference, you might end
up with an error from postgres ("role "tapp" does not exist"). In that case stop/remove the containers and its volumes,
`docker-compose down -v`, and restart deployment from step 2.

### Recipe for updating a functioning deployment <a id="updateDeployment"></a>

Update the app after a hotfix or other improvement:

Note, do NOT mess with down. It deletes stuff. (down is not the opposite of up)

In preparation, do:

```
git fetch && git status
```

Stare at the status output for a moment to make sure you are good for
a fast forward.. (in case somebody has changed a file locally)

Regardless of whether the app is running or not:

```
git pull && docker-compose up -d --build && docker-compose exec rails-app rake db:migrate
```

Note that the build container step can take a long time, or can be quick, depending on what has changed.


#### pedantic

1. Fetch and apply changes: `git pull`
2. Rebuild the app with the following command:
    ```
    docker-compose build rails-app
    ```
3. If necessary, perform database migrations:
    ```
    docker-compose run rails-app rake db:migrate
    ```
    You can check the status of migrations:
    ```
    docker-compose run rails-app rake db:migrate:status
    ```
4. Then, restart `rails-app` only:
    ```
    docker-compose up -d --no-deps rails-app
    ```

Note: number 2 will update the rails app but not touch the database.

## FirstDeploymentCombinedCpTappApp <a id="FirstDeploymentCombinedCpTappApp"></a>

The  first time  we deploy  the combined  app (sept/2017,  after which this
section will likely only be a source of hints for how to recover from a catastrophich failure).
Then, we  needed to  import Karen's assignments from the tapp app running on docker.

### michelle's recipe for the one-time migration

NB. the seemingly redundant up/down sequence is because we want to
nuke the postgres volumes (down -v) and then re-initialize the volume
and database server (up) so we can run drop (now have a truly empty
postgress with no tables) which we can pour the backup into.
We run migrate in case the tables from the backup were backlevel relative to our rails app.

```
[3:47 PM]
michellemtchai @everyone The dump of the TAPP data to TAPP-CP works! The trick was to keep the `POSTGRES_DB=tapp_production` and `POSTGRES_USER=tapp` in the `.env` file. This way `tapp-cp` takes the data from the dump as the main database. The steps to get the TAPP data to TAPP-CP is the following:
1) `docker-compose down -v`
2) `docker-compose up`
3) do `Ctrl+C` to close docker
4) `docker-compose run rails-app rake db:drop`
5) `cat filename | docker exec -i tappcp_postgres_1 psql -U postgres`
6) `docker-compose up`
7) `docker-compose run rails-app rake db:migrate`
```

## logging

When you run `docker-compose up -d` the stdout goes to a well hidden file. To see where it is for a given service, for instance our rails-app service, type:

```
docker-compose logs --follow rails-app 
```

## Backup/Restore of database <a id="backuprestore"></a>

We should automatically backup postgres every few minutes.
The restore procedure is manual for emergencies when we need to step back to a backup

### temporary workaround

in production we are unable to run db:drop because

```
ActiveRecord::ProtectedEnvironmentError: You are attempting to run a destructive action against your 'production' database.
If you are sure you want to continue, run the same command with the environment variable:
DISABLE_DATABASE_ENVIRONMENT_CHECK=1
```

So we drop by hand.

First, start postgres service

```
docker-compose run postgres
```

Second, find out the name of the postgres container.

```
docker ps
```

in the following, we saw tappcp_postgres_1 in the NAME column


```
docker exec -it tappcp_postgres_1 psql -U postgres
```

now talk to psql (just like the 1970's!

```
postres-# \c postgres
You are now connected to database "postgres" as user "postgres".

postgres=# \l
                                 List of databases
   Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges   
-----------+----------+----------+------------+------------+-----------------------
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
(3 rows)

postgres-# drop database tapp_production;
```

don't forget that SEMICOLON !!


now restore the database dump from backup:

```
cat filename | docker exec -i tappcp_postgres_1 psql -U postgres
```

and migrate:

`docker-compose run rails-app rake db:migrate`

Finally start up the services:

```
docker-compose up -d
```


### Backup & Restore <a id="backup-restore"></a>
While the application is running,
1. Back up the database and its content:
    ```
    docker-compose exec postgres pg_dumpall -U postgres > filename
    ```
2. Stop & remove all running containers and erase their volumes:
    ```
    docker-compose down -v
    ```

3. Start up docker:
    ```
    docker-compose up
    ```

4. Drop the database that was created on docker-compose up:
    ```
    docker-compose run rails-app rake db:drop
    ```

5. Restore backup:
  ```
  cat filename | docker exec -i tapp_postgres_1 psql -U postgres
  ```

#### peeking at backups

Hourly postgress sql dumps are stored in a safe place off the production machine, but remain in:

`tapp.cs.toronto.edu:/var/data/tapp`

So, if suspicious, you can check to make sure assignments, etc, are making it into the database by reading the sql.
You can always grep and/or diff the dumps to find if and when assignments were made, etc.

## Task commands
The following command looks at the current date and checks the database for the number of offers accepted in the last 24 hours (for Tuesday - Friday) and 3 days (for Monday) and decide whether to send an email alert to the HR admin or not. The following command is intended to be run from cron daily. Whether the email is sent is decided by the task.

`docker-compose run rails-app rake email:status`

## TODO
- [] JavaScript testing
- [] Build Docker images on CI
