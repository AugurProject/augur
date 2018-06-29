FROM node:8 as builder

WORKDIR /app/

COPY wait-for-url.sh wait-for-url.sh
COPY config.json config.json
COPY tsconfig.json tsconfig.json
COPY certs certs

COPY package.json package.json
RUN git init && npm install && rm -rf .git

COPY src src
COPY test test
RUN npm run build
RUN npm pack

COPY knexfile.js knexfile.js

FROM node:8
EXPOSE 9001
WORKDIR /app/
COPY --from=builder /app/node_modules node_modules

COPY --from=builder /app/augur-node*.tgz /app
RUN tar xzf augur-node*.tgz && mv package/* . && rm -rf package

COPY docker-entrypoint.sh docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
