FROM ubuntu

RUN sudo apt-get update
RUN sudo apt-get install -y nodejs npm git
RUN sudo apt-get clean
RUN sudo ln /usr/bin/nodejs /usr/bin/node

RUN sudo npm install -g grunt-cli

RUN git clone https://github.com/AugurProject/augur-client.git

WORKDIR augur-client

RUN npm install
RUN grunt browserify:build

CMD ["npm", "start"]
