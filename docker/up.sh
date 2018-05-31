#!/bin/bash

source docker/_var.sh

APP_ENV=${APP_ENV} \
APP_VERSION=${APP_VERSION} \
APP_NAME=${APP_NAME} \
APP_PORT=${APP_PORT} \
MAIN_DB_PWD=${MAIN_DB_PWD} \
LOG_DB_USERNAME=${LOG_DB_USERNAME} \
LOG_DB_PWD=${LOG_DB_PWD} \
CACHE_DB_PWD=${CACHE_DB_PWD} \
docker-compose -f ${YML_PATH} up --force-recreate -d

docker ps -a