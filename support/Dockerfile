# when updating node version, make sure link to yarn in /opt is still the correct version
ARG NODE_VERSION=10.15.3
FROM node:${NODE_VERSION}-alpine as node

RUN apk update \
  && apk upgrade \
  && apk add  --no-cache --virtual .build-dep git bash python make gcc g++

WORKDIR /augur
COPY . .

# RUN npm_config_devdir=/root/.node-gyp yarn --cache-folder=/root/.yarn-cache

#RUN yarn build

RUN apk update \
  && apk upgrade \
  && apk add  --no-cache libstdc++

RUN apk del .build-dep
