FROM augurproject/dev-node-geth:latest

# Install Node
RUN apk update \
  && apk upgrade \
  && apk add nodejs nodejs-npm

# Copy augur.js repo into it and get it set up
COPY . /augur.js
WORKDIR /augur.js
RUN  npm install \
  && chmod +x scripts/run-geth-and-deploy.sh \
  && ./scripts/run-geth-and-deploy.sh \
  && rm -rf node_modules

EXPOSE 8545 8546 30303 30303/udp 30304/udp

WORKDIR /
ENTRYPOINT [ "/start.sh" ]
