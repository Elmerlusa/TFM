include src/.env

#########################################################################
.PHONY: up down ps restart kill rm re logs mongoshell
#########################################################################
up:
	docker compose -f ./src/docker-compose.yml up -d

down: kill
	docker compose -f ./src/docker-compose.yml down --rmi local -v

ps:
	docker compose -f ./src/docker-compose.yml ps

restart:
	docker compose -f ./src/docker-compose.yml restart

kill:
	docker compose -f ./src/docker-compose.yml kill

rm:
	docker compose -f ./src/docker-compose.yml rm -f
	
re: kill down rm up

logs:
	docker compose -f ./src/docker-compose.yml logs

databaseup:
	docker compose -f ./src/docker-compose.yml up -d database

mongoshell:
	docker exec -it database mongosh -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD}

frontdev:
	npm start --prefix src/frontend

