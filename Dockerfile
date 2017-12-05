FROM node:8 as builder

WORKDIR /root/
COPY config.json config.json
COPY tsconfig.json tsconfig.json

COPY package.json package.json
RUN npm install

COPY src src
RUN npm run build

COPY knexfile.js knexfile.js
RUN npm run migrate

FROM node:8
EXPOSE 9001
WORKDIR /root/
COPY --from=builder /root/build build
COPY --from=builder /root/node_modules node_modules

COPY --from=builder /root/augur.db augur.db
COPY --from=builder /root/config.json config.json
COPY --from=builder /root/package.json package.json

ENTRYPOINT ["npm", "start"]
