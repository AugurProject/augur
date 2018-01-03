FROM node:8-alpine

ENV PATH /root/.yarn/bin:$PATH

# begin install yarn
# libusb-dev required for node-hid, required for ledger support (ethereumjs-ledger)
RUN apk update \
  && apk add git python make g++ bash curl binutils tar libusb-dev \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils
# end install yarn

# begin create caching layer
COPY package.json /augur/package.json
WORKDIR /augur
RUN git init \
  && yarn \
  && rm -rf .git \
  && rm package.json \
  && rm yarn.lock
# end create caching layer

COPY . /augur

# workaround a bug when running inside an alpine docker image
RUN rm /augur/yarn.lock

RUN yarn build
WORKDIR /augur
ENTRYPOINT [ "yarn", "dev" ]
