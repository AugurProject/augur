# augur | Production Deploy

---
## Summary and Audience

Augur **_does not_** serve **_any_** of the files required to run the client. Therefore Augur relies on the community to make the Augur client available. The dockerfile can be deployed for local or remote access depending on the network architecture, or the Augur client can be manually pinned in ipfs. Both configurations will be covered.

These instructions are for users that want to run Augur client to get access to the Augur platform. Some basic knowledge of Docker and git is needed. We'll progress from most basic to a little complicated.

## Step by Step: Deploying Augur client locally

Make sure Docker is installed, Get familar with docker [here](https://docs.docker.com/docker-hub/official_repos/).
Also make sure git is installed and in your execution path.

### Prerequisites
---
* Docker installed
* git installed
---
## Steps

    git clone https://github.com/AugurProject/augur.git
    cd <augur repository>
    docker build . -t augurclient

The above steps pull down the augur client code and build the docker file. Take note of the message `Successfully built <image hash>` you will need the image hash next.

Run the following command to bring up the newly built docker image and map port 80 to internal docker container port 80. The "RUN_LOCAL_ONLY=true" tells the docker container to bypass starting up ipfs. More on ipfs later.

    docker run -e "RUN_LOCAL_ONLY=true" -p 80:80 augurclient 

Once the docker continer is up and listening, you will see message `Now listening ...`, point your web browser to http://localhost

To stop your docker container, run these commands in a different command prompt and look for the container id that is running augurclient image:

    docker ps
    docker stop <docker container id>

Get the CONTAINER ID in order to stop the running container

---


## Step by Step: Deploying ipfs node of Augur client

Augur will not serve up the client, the ipns signature will be updated as part of the build process, which point the published hash to the build hash. The ipfs distributed network will be relied on to server up the Augur client for those users that aren't able to run it locally. The more ipfs nodes that can host the build directory the better. We have made this process clear so that anyone can help host Augur client in ipfs.

The same dockerfile describe above is used to host a ipfs node. Side note, if you are interested in manually pinning the client files, please reference our IPFS pinning instructions [here](./ipfs-configuration.md).

---

## Prerequisites

* Docker installed
* git installed

---

## Steps

    git clone https://github.com/AugurProject/augur.git
    cd <augur repository>
    docker build . -t augurclient

After docker image has been built successfully, check for message `Successfully built <image hash>`, run it with -p to map port to the internal docker container port, ipfs swarm will serve up files via port 4001. Optionally port 8001 uses nginx to pass requests to ipfs gateway hosted in the docker container. 

    docker run -p 4001:4001 -p 8001:8001 -t augurclient

Example using an ipfs gateway: Make sure the container is fully up and you see `Now listening ...`, the build dir hash will be in the output `Using build dir hash <build dir has>`, then point your web browser to:

    http://localhost:8001/ipfs/<build dir hash>

If you are running an ipfs node behind a firewall make sure port 4001 traffic flows. Firewall and network configurations are beyond the scope of this document.

You can run as ipfs node and have augur client build directory in one docker container. Here is the command to let docker map all ports for you:

    docker run -P -t augurclient

This command will tell you which local ports are mapped to ports on the docker container.

    docker ps

You will see output like this:

    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                                                     NAMES
    55ac13ede02a        25cb4b4ca479        "/tini -- bash /augu…"   11 seconds ago      Up 10 seconds       0.0.0.0:32800->80/tcp, 0.0.0.0:32799->4001/tcp, 0.0.0.0:32798->8001/tcp   dreamy_mccarthy

Notice all docker container ports have been mapped to local ports. This will allow for local access to Augur client and serve up Augur client via ipfs. For example, to serve up augur client point your web browser to:

    http://localhost:32800/

### Stoping docker container
To stop your docker container, run these commands in a different command prompt:

    docker ps
    docker stop <docker container id>

Get the CONTAINER ID in order to stop the running container

## Note

In order to keep augur client files pinned in ipfs a cron job runs every 24 hours to re-publish. 

Annoying is the ipfs publish message of `...ERROR        dht: loggableKey could not cast key...`.This is a known issue and can be ignored. It would be more accurate if it was logged as a WARNING.

---
