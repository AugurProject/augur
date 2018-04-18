# augur | Production Deploy

---
## Summary and Audience

Augur **_does not_** serve **_any_** of the files required to run the client. Therefore Augur relies on the community to serve their own Augur client.

These instructions are for users that want to run Augur client to get access to the Augur platform. Some basic knowledge of Docker and git is needed.

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

Run the following command to bring up the newly built docker image and map port 8080 to internal docker container port 80. 

    docker run -p 8080:80 augurclient 

Once the docker continer is up and listening, you will see message `Now listening ...`, point your web browser to http://localhost:8080

To stop your docker container, run these commands in a different command prompt and look for the container id that is running augurclient image:

    docker ps
    docker stop <docker container id>

Get the CONTAINER ID in order to stop the running container

---

