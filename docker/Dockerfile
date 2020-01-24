FROM node:12.14.1
MAINTAINER Caro carozzo@yahoo.com.tw

ARG APP_ENV
ARG APP_PORT
ARG APP_NAME

ENV NODE_ENV ${APP_ENV}
ENV APP_PORT ${APP_PORT}

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

# Install vim
RUN apt-get install -y vim

# Install npm
RUN npm i npm@latest -g

# Install pm2
RUN npm install pm2 -g

# Create app directory
RUN mkdir -p /var/app/${APP_NAME}

# Go to work path
WORKDIR /var/app/${APP_NAME}

# Copy package.json for npm install
COPY . /var/app/${APP_NAME}

# Install app dependencies
RUN npm install --quiet