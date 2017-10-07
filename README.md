# Augur Node

[![Build Status](https://travis-ci.org/AugurProject/augur-node.svg)](https://travis-ci.org/AugurProject/augur-node)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur-node/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur-node?branch=master)
[![npm version](https://badge.fury.io/js/augur-node.svg)](http://badge.fury.io/js/augur-node)

Augur Node is designed to be a standalone application, including a local
database setup that supports sqlite as well as postgresql. We use knex to
manage the local migrations and schema changes.

## Building
This project uses typescript and can be safely built via: `npm run build` or directly with `tsc`

## Schema Migrations
Migrations are managed via knex and behave similarly to ActiveRecord
migrations. As you add migrations, knex tracks the currect applied state in the
database, and allows you to apply new migrations as they come in.

See: [http://knexjs.org/#Migrations-CLI]

### Creating Migrations
New migrations are in typescript and are store in:
```src/migrations/```

To use the knex tool to generate a migration in this directly, use the *development* enironment:
```knex migrate:make -x ts --env development name```

### Running Migrations (For Test Env)
*Make sure your typescript is built before running migrations*

```knex migrate:latest --env test```

## Data Seeds
Seed files are used to seed the test database. Unlike migrations, seeds are
meant only for boostrapping, and so each time seeds are run all the source
files are executed (not just newly added ones). Currently the seeds files drop
and re-create the tables with each application. 

Seeds are stored in src/seeds/`<environment>`/*.ts.

See: [http://knexjs.org/#Seeds-CLI]

### Creating seeds
This is similar to creating new migrations, but only one should exist per table for clarity.

```knex seed:make seed_name --env development```

### Running seeds (For Test Env)

```knex seed:run --env test```

## Tests
Test requre a local sqlite database created with the migration and seed
commands above, as well as a compiled set of typescript. Our test framework
mocha will run tests out of the `tests/` directory recursively.

### Complete Pre-Test Setup
```
npm install
npm run build
knex migrate:latest --env test
knex seed:run --env test
```

# Running Tests
```
npm test
```

