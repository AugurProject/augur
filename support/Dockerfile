# when updating node version, make sure link to yarn in /opt is still the correct version
FROM node:10.15.3-alpine as node

RUN apk update \
  && apk upgrade \
  && apk add  --no-cache git bash python make gcc g++

WORKDIR /augur
ADD ./ .
RUN npm_config_devdir=/augur/.node-gpy yarn --cache-folder=/augur/.yarn-cache

RUN yarn build

FROM alpine:3.9
RUN apk update \
  && apk upgrade \
  && apk add  --no-cache libstdc++

COPY --from=node /usr/local/lib/ /usr/local/lib/
COPY --from=node /opt /opt
COPY --from=node /usr/local/bin/node /usr/local/bin/
COPY --from=node /augur /augur

RUN ln -s /opt/yarn-v1.13.0/bin/yarn /usr/local/bin/yarn
RUN cd /usr/local/bin && ln -s ../lib/node_modules/npm/bin/npm-cli.js npm
RUN cd /usr/local/bin && ln -s ../lib/node_modules/npm/bin/npx-cli.js npx

