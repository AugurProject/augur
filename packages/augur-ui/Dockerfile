FROM augurproject/augur-build:latest as augur-build
ARG build_environment=dev
ENV BUILD_ENVIRONMENT=$build_environment
ARG ethereum_network=rinkeby
ENV ETHEREUM_NETWORK=$ethereum_network


WORKDIR /augur

RUN set -ex; \
    if [ "$BUILD_ENVIRONMENT" = "dev" ]; then \
        ETHEREUM_NETWORK=$ethereum_network yarn workspace @augurproject/ui build --dev --augur-hosted --disableMainnet; \
    elif [ "$BUILD_ENVIRONMENT" = "dev-optimized" ]; then \
        ETHEREUM_NETWORK=$ethereum_network yarn workspace @augurproject/ui build --production --augur-hosted --disableMainnet; \
    elif [ "$BUILD_ENVIRONMENT" = "release" ]; then \
        ETHEREUM_NETWORK=$ethereum_network yarn workspace @augurproject/ui build --production --augur-hosted; \
    fi;

FROM nginx:alpine

COPY --from=augur-build /augur/packages/augur-ui/build/ /augur/build
COPY support/nginx-default.conf /etc/nginx/conf.d/default.conf
