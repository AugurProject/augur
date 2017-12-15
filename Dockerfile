FROM node:8 as builder

WORKDIR /app/
COPY config.json config.json
COPY tsconfig.json tsconfig.json

COPY package.json package.json
RUN npm install

COPY src src
RUN npm run build
RUN npm pack

COPY knexfile.js knexfile.js
RUN npm run migrate

FROM node:8
EXPOSE 9002
WORKDIR /app/
COPY --from=builder /app/node_modules node_modules

COPY --from=builder /app/augur-node*.tgz /app
RUN tar xzf augur-node*.tgz && mv package/* . && rm -rf package

COPY --from=builder /app/augur.db augur.db.tpl
COPY docker-entrypoint.sh docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
