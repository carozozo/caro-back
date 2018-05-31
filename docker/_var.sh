#!/bin/bash

source .env

# 只有 dev 環境的 app 才掛載 volume
YML_PATH="docker/docker-compose-no-volume.yml"
if [ ${APP_ENV} == "dev" ]; then
  YML_PATH="docker/docker-compose.yml"
fi