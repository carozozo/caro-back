#!/bin/bash

source docker/_var.sh

docker-compose -f ${YML_PATH} down

docker ps -a