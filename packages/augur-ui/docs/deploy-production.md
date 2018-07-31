# augur | Production Deploy

---
## Summary and Audience

Augur **_does not_** serve **_any_** of the files required to run the client. Therefore Augur relies on the community to server their own Augur client.

These instructions are for users who want to run the Augur client to get access to the Augur platform. Some basic knowledge of Docker and git is needed.

## Step by Step: Deploying Augur client locally

Make sure Docker is installed. Get familar with docker [here](https://docs.docker.com/docker-hub/official_repos/).
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

The above steps pull down the augur client code and build the Docker file. Take note of the message `Successfully built <image hash>`, as you will need this image hash.

Run the following command to bring up the newly-built Docker image and map port 8080 to internal Docker container port 80. 

    docker run -p 8080:80 augurclient 

Once the Docker continer is up and listening, you will see message `Now listening ...`. Go to http://localhost:8080 in your web browser.

To stop the Docker container, run these commands in a different command prompt and look for the container id that is running augurclient image:

    docker ps
    docker stop <docker container id>

Get the CONTAINER ID in order to stop the running container
---
