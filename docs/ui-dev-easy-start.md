# Augur | UI dev super easy Configuration

This is for UI developers already familiar with the different components but only want to work with the UI. This guide relys on two docker images, populated ethereum node and augur-node dev. Augur-node dev docker image is built every time master branch is updated, for questions ping us in Augur #dev channel.

## Requirements

You'll need to clone augur UI only:

* [augur git repo](https://github.com/AugurProject/augur)
* node and npm installed
* yarn installed
* docker installed
* docker compose, should come with docker

## Running docker compose

Open up a command shell in augur directory (where you cloned the repo). Then type:

    yarn
    
followed by: 

    npm run docker:spin-up

This command will download the needed docker files and start them up. (This might take awhile.) After the docker images are downloaded it's a quick start.



When the command shell output looks like this your good to move on:

```
...
node_1  | Starting websocket secure server on port 9002
node_1  | Starting websocket server on port 9001
node_1  | connecting to augur-node: undefined
node_1  | connecting to ethereum-node: {"http":"http://geth:8545","ws":"ws://geth:8546"}
node_1  | websocket ws://geth:8546 opened
node_1  | connected to ethereum
...
```




In a separate command shell start the UI

    yarn dev

Open a web browser at http://localhost:8080

Done


To stop the docker compose process use this command:

    npm run docker:spin-down


That is it, you should have everything you need to crank up the UI and start developing.
