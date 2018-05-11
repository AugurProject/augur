FROM node:8.10-stretch

ENV PATH /root/.yarn/bin:$PATH
ARG ethereum_network=rinkeby
ENV ETHEREUM_NETWORK=$ethereum_network

# begin install yarn
# libusb-dev required for node-hid, required for ledger support (ethereumjs-ledger)
RUN curl -s https://nginx.org/keys/nginx_signing.key | apt-key add - \
  && echo 'deb http://nginx.org/packages/debian/ stretch nginx' > /etc/apt/sources.list.d/nginx.list \
  && apt-get -y update \
  && apt-get -y upgrade \
  && apt-get -y install git python make g++ bash curl binutils tar libusb-1.0-0-dev cron nginx \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && echo "daemon off;" >> /etc/nginx/nginx.conf
# end install yarn

# Vhost to serve files
COPY support/nginx-default.conf /etc/nginx/conf.d/default.conf

# nginx logs
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

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
COPY support/local-run.sh /augur/local-run.sh

# workaround a bug when running inside an alpine docker image
RUN rm -f /augur/yarn.lock

RUN ETHEREUM_NETWORK=$ethereum_network yarn build --dev

# need arg to pass in for augur-ui (production) and augur-dev (dev)
RUN git rev-parse HEAD > /augur/build/git-hash.txt \
  && git log -1 > /augur/build/git-commit.txt \
  && chmod 755 /augur/local-run.sh \
  && cd /augur

EXPOSE 80

WORKDIR /augur
# Add Tini
ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

CMD ["bash", "/augur/local-run.sh"]
