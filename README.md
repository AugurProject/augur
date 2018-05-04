# Augur Node

[![Build Status](https://travis-ci.org/AugurProject/augur-node.svg)](https://travis-ci.org/AugurProject/augur-node)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur-node/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur-node?branch=master)
[![npm version](https://badge.fury.io/js/augur-node.svg)](http://badge.fury.io/js/augur-node)

Augur Node is designed to be a standalone application, including a local
database setup that supports sqlite as well as postgresql. We use knex to
manage the local migrations and schema changes.

## Building
This project uses typescript and can be safely built via: `npm run build` or directly with `tsc`. Augur Node requires Node 8.

## Running

### Configuration

By default, Augur Node is configured to connect to a locally-running Ethereum node at http://localhost:8545 and ws://localhost:8546. To connect to a hosted Ethereum node, set the ENDPOINT_HTTP and ENDPOINT_WS environment variables, as follows:

    $ export ENDPOINT_HTTP=https://rinkeby.ethereum.nodes.augur.net 
    $ export ENDPOINT_WS=wss://websocket-rinkeby.ethereum.nodes.augur.net

### Starting

For a quick start, use the `clean-start` script included with our package.json:

```
$ npm install # If you haven't yet done so
$ npm run clean-start
```
This will ensure the code has been built, and database migrations run for a fresh start. This will blow away any data that is currently stored in your node.

If you'd like to simply start a node and begin syncing where you left off, use the `start` script:

```
$ npm run start
```
    
### Docker
Augur Node has a Dockerfile and publish docker image which is capable of running augur-node connected to an ethereum node. This will only work out-of-the-box for networks which have been deployed as part of our development deployment process (right now, only Rinkeby).

```
$ export ENDPOINT_HTTP=https://rinkeby.ethereum.nodes.augur.net 
$ export ENDPOINT_WS=wss://websocket-rinkeby.ethereum.nodes.augur.net
$ scripts/docker/run.sh
```
    
### Hosted Ethereum nodes

Currently, augur node has configurations built in for connecting to our hosted rinkeby node. More will be added as we bring up these nodes. For each possible network, pass the network name to the start command for augur-node. E.g. to use clean-start to run with a fresh database:

```
$ npm run clean-start -- rinkeby
```

or to run without clearing out previous state:
```
npm run start -- rinkeby
```

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
Seed files are used to seed the *test* database. Unlike migrations, seeds are
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
