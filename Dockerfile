FROM node:6-alpine

ENV PATH /root/.yarn/bin:$PATH

# begin install yarn
# Using --nightly yarn due to this bug: https://github.com/yarnpkg/yarn/issues/4363
RUN apk update \
  && apk add git python make g++ bash curl binutils tar \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --nightly \
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
