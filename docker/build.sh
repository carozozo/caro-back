#!/bin/bash

source docker/_var.sh

docker build \
--build-arg APP_ENV=${APP_ENV} \
--build-arg APP_PORT=${APP_PORT} \
--build-arg APP_NAME=${APP_NAME} \
--rm \
-f docker/Dockerfile \
-t="carozozo/${APP_NAME}:${APP_ENV}-${APP_VERSION-latest}" .

docker rmi -f $(docker images | grep "<none>" | awk '{print $3}')

if [ ${APP_ENV} != "dev" ]; then
  docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PWD}
  docker push carozozo/${APP_NAME}:${APP_ENV}-${APP_VERSION-latest}
  docker logout
fi