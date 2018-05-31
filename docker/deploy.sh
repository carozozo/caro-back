#!/bin/bash

source docker/_var.sh

AWS_HOST="52.197.183.24"
AWS_USERNAME="ubuntu"

RSA_PATH="~/.ssh/caro_rsa"

# 放置啟動 app 項目
START_APP_DIR="~/startApp"
# 放置啟動 docker 項目
START_DOCKER_DIR="${START_APP_DIR}/docker"

ssh-add ${RSA_PATH}

ssh -A ${AWS_USERNAME}@${AWS_HOST}<< EOF
  mkdir -p ${START_DOCKER_DIR}
EOF

scp .env ${AWS_USERNAME}@${AWS_HOST}:${START_APP_DIR}
scp ${YML_PATH} ${AWS_USERNAME}@${AWS_HOST}:${START_DOCKER_DIR}
scp docker/_var.sh ${AWS_USERNAME}@${AWS_HOST}:${START_DOCKER_DIR}
scp docker/up.sh ${AWS_USERNAME}@${AWS_HOST}:${START_DOCKER_DIR}

ssh -i ~/.ssh/caro_rsa -A ${AWS_USERNAME}@${AWS_HOST}<< EOF
  cd ${START_APP_DIR}
  bash docker/up.sh ${APP_ENV} ${APP_VERSION}
  cd ~
  rm -rf ${START_APP_DIR}
EOF
