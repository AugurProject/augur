FROM node:10.15.0-alpine as node
RUN ls -l /usr/local/lib
RUN ls -l /opt/

RUN apk update \
  && apk upgrade \
  && apk add  --no-cache git bash python make gcc g++

WORKDIR /augur
ADD ./ .
RUN yarn

FROM alpine:3.8
RUN apk update \
  && apk upgrade \
  && apk add  --no-cache libstdc++

COPY --from=node /usr/local/lib/ /usr/local/lib/
COPY --from=node /opt /opt
COPY --from=node /usr/local/bin/node /usr/local/bin/
COPY --from=node /augur /augur
RUN ln -s /opt/yarn-v1.12.3/bin/yarn /usr/local/bin/yarn
RUN cd /usr/local/bin && ln -s ../lib/node_modules/npm/bin/npm-cli.js npm
RUN cd /usr/local/bin && ln -s ../lib/node_modules/npm/bin/npx-cli.js npx

