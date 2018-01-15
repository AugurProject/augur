# augur | Production Deploy

---
## Summary

Augur **_does not_** serve **_any_** of the files required to run the client. Therefore Augur relies on the community to make the Augur client available. The dockerfile can be deployed for local or remote access depending on the network architecture, or the Augur client can be manually pinned in ipfs. Both configurations will be covered.

## Running Augur client locally

### Prerequisites
---
* Docker installed
* git installed
* node installed
---
## Setup

    git clone https://github.com/AugurProject/augur.git
    cd <augur repository>
    npm i
    docker build .

After docker image has been build run it with -p to map exposed port

    docker run -p 8001:8001 <docker image>

This will run nginx to service up two endpoints, we are interested in port 8001, point your web browser to http://localhost:8001/index.html


## Running Augur client Remotely

This same dockerfile can be run on a remote server and port 8001 can be exposed to be made available externally.

---


## Running ipfs node of Augur client

Augur will not serve up the client, it'll build and update the ipns signature to point to the latest build hash. The ipfs distributed network will be relied on to server up the Augur client. The more ipfs nodes that can host the build directory the better. Augur will .

There is a dockerfile that can run ipfs node hosting Augur client. If you are interested in manually pinning the client files , please reference our IPFS pinning instructions [here](./ipfs-configuration.md).

---

## Prerequisites

* Docker installed
* git installed
* node installed

---

## Setup

    git clone https://github.com/AugurProject/augur.git
    cd <augur repository>
    npm i
    docker build .

After docker image has been build run it with -p to map exposed port, ipfs swarm will serve up files via 4001.

    docker run -p 4001:4001 <image hash>

Notice that if you are running a ipfs node behind a firewall makes sure port 4001 traffic flows.


## Note

Notice that all ports can be available on the docker container which will allow for local access to Augur client and serve up Augur client via ipfs.

    docker run -P <image hash>


