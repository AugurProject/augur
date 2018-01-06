FROM node:8-wheezy

ENV PATH /root/.yarn/bin:$PATH

# begin install yarn
# libusb-dev required for node-hid, required for ledger support (ethereumjs-ledger)
RUN apt-get -y update \
  && apt-get -y install git python make g++ bash curl binutils tar libusb-dev build-essential nginx \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && echo "pid /var/run/nginx.pid;" >> /etc/nginx/nginx.conf \
  && echo "daemon off;" >> /etc/nginx/nginx.conf
# end install yarn

# Vhost to serve files
COPY support/nginx-default.conf /etc/nginx/conf.d/default.conf

# begin create caching layer
COPY package.json /augur/package.json
WORKDIR /augur
RUN git init \
  && yarn add require-from-string \
  && yarn \
  && rm -rf .git \
  && rm package.json \
  && rm yarn.lock
# end create caching layer

COPY . /augur

# workaround a bug when running inside an alpine docker image
RUN rm /augur/yarn.lock

RUN ETHEREUM_NETWORK=rinkeby yarn build --dev

RUN git rev-parse HEAD > /augur/build/git-hash.txt \
  && git log -1 > /augur/build/git-commit.txt

# install and configure ipfs
RUN curl -O https://dist.ipfs.io/go-ipfs/v0.4.13/go-ipfs_v0.4.13_linux-amd64.tar.gz \
  && tar -xvf go-ipfs_v0.4.13_linux-amd64.tar.gz \
  && cd go-ipfs \
  && ./install.sh \
  && ipfs init

EXPOSE 8080

WORKDIR /augur
ENTRYPOINT [ "nginx" ]
