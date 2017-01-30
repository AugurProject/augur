FROM node:6-alpine

ENV PATH /root/.yarn/bin:$PATH

# begin install yarn
RUN apk update \
  && apk add git python make g++ bash curl binutils tar \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils
# end install yarn

# begin create caching layer
COPY package.json /augur/package.json
COPY yarn.lock /augur/yarn.lock
COPY scripts/lifecycle/post-install.js /augur/scripts/lifecycle/post-install.js
WORKDIR /augur
RUN git init \
  && yarn \
  && rm -rf .git \
  && rm package.json \
  && rm yarn.lock \
  && rm scripts/lifecycle/post-install.js
# end create caching layer

COPY . /augur

# workaround a bug when running inside an alpine docker image
RUN sed -i -e 's/^/# /' /augur/browserslist

RUN yarn build
WORKDIR /augur
ENTRYPOINT [ "yarn", "dev" ]
