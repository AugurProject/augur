FROM node:8

EXPOSE 9001

COPY config.json /root/augur-node/config.json
COPY tsconfig.json /root/augur-node/tsconfig.json
COPY package.json /root/augur-node/package.json
COPY src /root/augur-node/src

WORKDIR /root/augur-node
RUN npm install
RUN npm run build

ENTRYPOINT ["npm", "start"]
