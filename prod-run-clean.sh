#!/bin/bash

die(){
	echo $*
	exit 2
}

# start up tapp for production 

echo 'have you shut down containers already with docker down?'
echo 'examine running containers, if any in table below'
docker ps

echo
echo 'if there are any tapp containers listed above you should consider '
echo 'docker-compose down, perhaps even down -v (to remove the postgres volume)'
echo

read -p 'hit enter to continue: [interrupt to quit]: '

read -p 'enter to cp prod.env.devfault .env :' JUNK

(set -x
cp prod.env.default .env || die failed to copy prod.env.default
)

read -p 'enter to `docker rm -f` your containers: ' JUNK

(set -x
docker-compose rm -f  || die docker-compose rm -f failed
)

read -p 'enter to `docker-compose build --force-rm`  ' JUNK

(set -x
docker-compose build --force-rm || die docker-compose up --force-recreate failed
)

read -p 'enter to `docker-compose up tapp containers: (will want -d in production) ' JUNK

(set -x
docker-compose up -d --force-recreate || die docker-compose up --force-recreate failed
)

#there is probably a race condition here. migrate can't work until container is really up.
read -p 'enter to `migrate postgres db: ' JUNK

(set -x
docker-compose run rails-app rake db:migrate  || die "rake db:migrate failed"
)

