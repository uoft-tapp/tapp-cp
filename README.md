# README

This is a template for building an app with Rails 5.1 + React in Docker.

## Starting application
You should have a reasonably recent version of Docker
[installed](https://docs.docker.com/engine/installation/). Also, check that
you have Docker Compose installed.

Copy the `dev.env.default` file to `.env`.  This file is where the docker components
will pickup environment variables such as the postgres username and password.

```
cp dev.env.default .env
```

Once that's out of the way, clone this repo, navigate into the cloned
directory, and run

```
docker-compose up
```

In a new tab, open http://localhost:3000 to see the Rails welcome page!

On the technical side, `docker-compose up` launched two containers: `rails-app`
and `webpack-dev-server`. The former runs the Rails app, while the latter
watches and compiles React files located in `app/javascript/packs`.

## Trying things out
Application code is linked into containers with live reloading, so you can
see changes you make locally right away!

You have full control over Rails code, apply the usual methods. Check the next
section for details on running commands like `rake …` and `rails …`.

To get you started with React quicker, this app comes preloaded with a simple
React app. Visiting http://localhost:3000/hello_react will load JavaScript code
located in `app/javascript/packs/hello_react.jsx`.

## Running commands
To run any `bundle …`, `rails …`, `rake …`, or `yarn …` commands, launch them
via `rails-app` service. For example, `rails generate controller Welcome` is
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

Try `docker-compose down`, then `docker-compose up`. This should delete
existing images for this project and rebuild them from scratch.


## TODO
- [] JavaScript testing
