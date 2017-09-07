#!/bin/bash

die(){
	echo $*
	exit 2
}

# start up tapp for production 

echo 'have you pulled from master appropriately?'
git status

echo
echo 'have you shut down containers already with docker down?'
echo 'examine running containers, if any in table below'
docker ps

echo
echo 'if there are any tapp containers listed above you should consider '
echo 'docker-compose down, perhaps even down -v (to remove the postgres volume)'
echo
echo '*** to really nuke the containers consider `docker system prune --all --force` ***'
echo

read -p 'hit enter to continue: [interrupt to quit]: '

read -p 'enter to cp prod.env.devfault .env :' JUNK

(set -x
cp prod.env.default .env
)

read -p 'enter to `docker-compose build`  ' JUNK

(set -x
docker-compose build || die docker-compose build  failed
)

read -p 'enter to `docker-compose up -d tapp containers: ' JUNK

(set -x
docker-compose up -d  || die docker-compose up -d failed
)

#there is probably a race condition here. migrate can't work until container is really up.
#in production we set restart policy to be always so containers restart after reboot -- 
# but this causes an admin task like a migration to restart even when it exits 0
# so add another layer of composition (admin) that turns off the restart

read -p 'enter to `migrate postgres db: ' JUNK

# (set -x
#   docker-compose \
#    -f docker-compose.yml \
#    -f docker-compose.production.yml \
#    -f docker-compose.production-admin.yml \
#    run rails-app rake db:migrate 
# )|| die "rake db:migrate failed"


(set -x
  docker-compose  run rails-app rake db:migrate  || die "rake db:migrate failed"
)

echo to see the log: docker-compose logs --follow
