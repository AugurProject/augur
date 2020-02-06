---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

## Getting started on Ubuntu 18.04

Install the following:

Yarn 1.21.1
Nodejs >=10.14.2
Docker 19.03.5
Docker-Compose 1.25.2

On Ubuntu 18.04, the versions of Docker and Docker-Compose in the default apt are too low.  To install a more recent Docker:

```
sudo apt -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
sudo apt remove docker docker-engine docker.io containerd runc
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt -y install docker-ce docker-ce-cli containerd.io
```

If you don't already have a `docker` user and group, do:

```
sudo usermod -aG docker $USER
newgrp docker
```

To install a more recent Docker-Compose:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Clone the augur monorepo:
```
git clone https://github.com/AugurProject/augur.git
cd augur
git fetch origin && git checkout master && git pull
```

Remove any existing docker containers:
```
docker kill $(docker ps -a -q);
docker system prune -af
```

If you have postgres running on your computer, shut it down (or change its port number).  The augur docker-compose includes a postgres instance for its Gnosis relayer, which expects the default postgres port 5432 to be available.
```
sudo systemctl stop postgresql
```

Use yarn to install and build everything:
```
yarn clean
yarn
yarn build
yarn docker:all
```
Leave this terminal open; `yarn docker:all` will continue to run indefinitely.

In another terminal, build the UI:
```
yarn ui dev
```

When this finishes, open up MetaMask in your browser, and make sure it is connected to localhost:8545 (the local geth instance that docker-compose spun up).  Go to http://localhost:8080 in your browser and the Augur UI should load.

Click on "login".  Select MetaMask/web3, and check the Gnosis Safe checkbox in the lower right hand corner.  This will create a contract wallet for you which will automatically receive testnet DAI.
