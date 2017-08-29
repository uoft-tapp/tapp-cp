#!/bin/bash

die(){
	echo $*
	exit 2
}

# start up tapp for development 

echo 'have you shut down containers already with docker down?'
echo 'examine running containers, if any in table below'
docker ps

echo
echo 'if there are any tapp containers listed above you should consider '
echo 'docker-compose down, perhaps even down -v (to remove the postgres volume)'
echo

read -p 'hit enter to cp dev.env.devfault .env : ' JUNK

(set -x
cp dev.env.default .env || die failed to copy dev.env.default
)

#TODO: factor following. currently code copy of prod version!

read -p 'enter to `docker rm -f` your containers: ' JUNK

(set -x
docker-compose rm -f  || die docker-compose rm -f failed
)

read -p 'enter to `docker-compose up tapp containers: ' JUNK

(set -x
docker-compose up -d --force-recreate || die docker-compose up --force-recreate failed
)

read -p 'enter to `migrate postgres db: ' JUNK

(set -x
docker-compose run rails-app rake db:migrate  || die "rake db:migrate failed"
)


