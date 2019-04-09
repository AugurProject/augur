ARG NODE_VERSION=10.15.0
FROM node:${NODE_VERSION}-alpine as builder

ENV PATH /root/.yarn/bin:$PATH
ARG ethereum_network=rinkeby
ENV ETHEREUM_NETWORK=$ethereum_network
ARG build_environment=dev
ENV BUILD_ENVIRONMENT=$build_environment
RUN apk --no-cache add \
    bash \
    binutils \
    eudev-dev \
    g++ \
    git \
    libusb-dev \
    linux-headers \
    make \
    python


# begin create caching layer
COPY package.json /augur/package.json
ADD https://nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-headers.tar.gz /augur/node-v${NODE_VERSION}-headers.tar.gz
WORKDIR /augur
RUN git init \
  && yarn add require-from-string \
  && yarn \
  && rm -rf .git \
  && rm package.json \
  && rm yarn.lock
# end create caching layer

COPY . /augur
COPY support/local-run.sh /augur/local-run.sh

# workaround a bug when running inside an alpine docker image
RUN rm -f /augur/yarn.lock

RUN set -ex; \
    if [ "$BUILD_ENVIRONMENT" = "dev" ]; then \
        ETHEREUM_NETWORK=$ethereum_network yarn build --dev --augur-hosted --disableMainnet; \
    elif [ "$BUILD_ENVIRONMENT" = "dev-optimized" ]; then \
        ETHEREUM_NETWORK=$ethereum_network yarn build --production --augur-hosted --disableMainnet; \
    elif [ "$BUILD_ENVIRONMENT" = "release" ]; then \
        ETHEREUM_NETWORK=$ethereum_network yarn build --production --augur-hosted; \
    fi;

# need arg to pass in for augur-ui (production) and augur-dev (dev)
RUN git rev-parse HEAD > /augur/build/git-hash.txt \
  && git log -1 > /augur/build/git-commit.txt \
  && chmod 755 /augur/local-run.sh \
  && cd /augur

RUN rm -rf node_modules && \
    npm config set loglevel silly && \
    npm config set tarball /augur/node-v${NODE_VERSION}-headers.tar.gz && \
    yarn install --production

FROM node:10.15.0-alpine

RUN apk --no-cache add \
    bash \
    binutils \
    nginx \
    && echo "daemon off;" >> /etc/nginx/nginx.conf

# nginx logs
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

WORKDIR /augur

COPY --from=builder /augur /augur

# Vhost to serve files
COPY support/nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["bash", "/augur/local-run.sh"]
