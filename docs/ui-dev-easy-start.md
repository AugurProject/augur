# Augur | UI dev super easy Configuration

This is for UI developers already familiar with the different components but only want to work with the UI. This guide relys on two docker images, one for populated ethereum node and the other is augur-node dev. Augur-node dev docker image is built manually so it might get out of date, ping dev channel in Augur #dev channel.

## Requirements

You'll need to clone augur UI only:

* [augur git repo](https://github.com/AugurProject/augur)
* node and npm installed
* yarn installed
* docker installed
* docker compose, should come with docker

## Running docker compose

Open up a command shell in augur directory (where you cloned the repo), This might take awhile because it's downloading images. After the docker images are downloaded it's a quick start.

    npm run docker:spin-up

This command will download the needed docker files and start them up.

In a separate command shell start the UI

    yarn dev

Open a web browser at http://localhost:8080

Done


To stop the docker compose process use this command:

    npm run docker:spin-down


That is it, you should have everything you need to crank up the UI and start developing.
