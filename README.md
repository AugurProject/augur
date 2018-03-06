# Augur Node

[![Build Status](https://travis-ci.org/AugurProject/augur-node.svg)](https://travis-ci.org/AugurProject/augur-node)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur-node/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur-node?branch=master)
[![npm version](https://badge.fury.io/js/augur-node.svg)](http://badge.fury.io/js/augur-node)

Augur Node is designed to be a standalone application, including a local
database setup that supports sqlite as well as postgresql. We use knex to
manage the local migrations and schema changes.

## Building
This project uses typescript and can be safely built via: `npm run build` or directly with `tsc`

## Connecting to an Ethereum Node

By default, Augur Node is configured to connect to a locally-running Ethereum node. To connect to a hosted Ethereum node instead, change the `http` and `ws` values in the `ethereumNodeEndpoints` object of [config.json](https://github.com/AugurProject/augur-node/blob/master/config.json) as follows:

    {
        "augurDbPath": "./augur.db",
        "ethereumNodeEndpoints": {
            "http": "https://rinkeby.ethereum.nodes.augur.net", // Defaults to "http://localhost:8545"
            "ws": "wss://websocket-rinkeby.ethereum.nodes.augur.net" // Defaults to "ws://localhost:8546"
        },
        "uploadBlockNumbers": {
            "1": 4086425,
            "3": 1377804,
            "4": 1347000
        }
    }

Another way to connect to a hosted Ethereum node is by setting the ENDPOINT_HTTP and ENDPOINT_WS environment variables, as follows:

    $ export ENDPOINT_HTTP=https://rinkeby.ethereum.nodes.augur.net 
    $ export ENDPOINT_WS=wss://websocket-rinkeby.ethereum.nodes.augur.net

## Schema Migrations
Migrations are managed via knex and behave similarly to ActiveRecord
migrations. As you add migrations, knex tracks the currect applied state in the
database, and allows you to apply new migrations as they come in.

See: [http://knexjs.org/#Migrations-CLI]

### Creating Migrations
New migrations are in typescript and are store in: ```src/migrations/```

To use the knex tool to generate a migration in this directly, use the *development* enironment:

```
knex migrate:make -x ts --env development name
```

### Running Migrations
*Make sure your typescript is built before running migrations*

```
knex migrate:latest --env build
```

## Data Seeds
Seed files are used to seed the test database. Unlike migrations, seeds are
meant only for boostrapping, and so each time seeds are run all the source
files are executed (not just newly added ones). Currently the seeds files drop
and re-create the tables with each application. 

Seeds are stored in src/seeds/`<environment>`/*.ts.

See: [http://knexjs.org/#Seeds-CLI]

### Creating seeds
This is similar to creating new migrations, but only one should exist per table for clarity.

```
knex seed:make seed_name --env development
```

### Running seeds (For Build Env)

```
knex seed:run --env build
```

## Tests
Tests run with in-memory SQLite DBs for each test execution so they won't
overlap each other. The framework will automatically initialize and seed the
tests with the data in seed/test for each test.

### Complete Pre-Test Setup
```
npm install
npm run build
```

# Running Tests
```
npm test
```


# Docker Cloud Deployment Workflow
Getting from code to deployed relies on several pieces that all work together in a simple way, but the number of peices makes the whole thing seem complicated. This section discusses how these pieces fit together.

Thise GitHub repository (augur-node) has several webhooks. On PRs, for instance, it notifies travis to execute a test build (which posts back the test state to the commit that was acted on). However, travis is not involved with augur-node deployment (unlike contract deployment!). A different webhook calls out to Docker Cloud to trigger the build of a docker container.
Links:
- [GitHub: Augur-node webhooks](https://github.com/AugurProject/augur-node/settings/hooks)
- [Docker Cloud: Augur-node build job](https://cloud.docker.com/app/augurproject/repository/docker/augurproject/augur-node/general)
- [Docker Cloud: Augur-node build job branch specs](https://cloud.docker.com/app/augurproject/repository/docker/augurproject/augur-node/builds/edit)

In Docker Cloud, a new Docker image is built on deploy to master, with the Docker image tag "dev". The full image reference is `AugurProject/augur-node:dev`, which always tracks successful builds of master. This image is used across several different augur-node "services" (which are backed by one or more "containers"). Let's look at Rinkeby as an example, but the following holds true for all other augur-node services (clique, aura, instantseal)

[Augur-Node-Rinkeby Docker Cloud Service](https://cloud.docker.com/app/augurproject/service/5100a824-9b1c-4506-91d0-d84346fb3d3a/general)

The Augur-Node-Rinkeby Docker Cloud Service specifies that we want to use the (above-built) "AugurProject/augur-node:dev", deployed to 3 containers, each with an ENDPOINT_HTTP that points at an Ethereum Node Sync'd to Rinkeby (http://rinkeby.ethereum.origin.augur.net:8545). It is this single environment variable that influences an augur-node to become associated with a specific network.

The Augur-Node-Rinkeby Docker Cloud Service has the "AUTOREDEPLOY" option enabled, which monitors for new versions of the corresponding image (`AugurProject/augur-node:dev`) and redeploys (terminates containers, starts new containers) the service's containers with the new image. This will create brand new containers (with the `ENDPOINT_HTTP` still set appropriately, as it comes from the service). 

Before we move on to haproxy, let's note what we have here. We have a system where
- pushing a commit to augur-node's master branch causes a new Docker image to be built: AugurProject/augur-node:dev
- many services are all relying on this one docker image, each specifying a different `ENDPOINT_(WS|HTTP)` value to change which network the augur-node operates on.
- A new Docker image being pushed forces a redeploy of all dependent services, ensuring they get the new code, deployed to fresh containers, with the appropriate variables set (since they are defined in the service)

# Haproxy
The above system auto-deploys augur-node Docker containers, sync'd to a variety of networks. The problem we haven't solved yet is how the clients will end up discovering and using these services. Some services (aura/clique) are backed by just a single augur-node. Other services (rinkeby) are backed by 3. If any of these services or nodes fail, the issue should be routed around seamlessly. Additionally, when new versions are deployed, they could land on different servers, and often times one physical host is running multiple augur-node's, even exposing the ports without causing conflicts gets complicated.

For this, we use haproxy. Haproxy itself runs inside of a container. The haproxy Docker Cloud service configuration specifies other Docker Cloud services which are "linked". A linked service has data about the containers that make up a service provided as environment variables, such as `AUGUR_NODE_RINKEBY_ENV_DOCKERCLOUD_IP_ADDRESS=10.7.0.8/16`. This information is dynamic, so as the location and configuration of the services change, haproxy can continue to find the backing services. From this (rather large) set of environment variables provided to the haproxy container, the haproxy container generates its own configuration file. Now, by exposing only haproxy, all other services can be discovered, regardless of where they are currently running or how many. Additionally, since haproxy is operating at the http layer, we can use name-based virtual hosting to allow all services to listen on the same port (such as 80 and 443) and select the correct backing server based on the name lookup, as well as provide SSL termination.

Haproxy determines the hostname-to-service mapping via an environment variable that is exported by the backing service itself. For instance, let's look at the configuration for the Augur-Node-Rinkeby Service. One of the environment variables the service defines:
```
VIRTUAL_HOST=https://rinkeby.augur.nodes.augur.net:443,\
	http://rinkeby.augur.nodes.augur.net:80,\
	http://rinkeby.augur.origin.augur.net:9001
```

Docker provides haproxy with environment variables from linked services/containers. When haproxy is generating its configs, it will read through all exported VIRTUAL_HOST entries from each linked service, and create front-end (handling the connection from the client) configurations to route to the backend, any container for that service. In the above example, hitting any of those 3 endpoints will route to a container running augur-node-rinkeby.
