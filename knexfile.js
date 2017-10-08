const { augurDbPath } = require("./config.json");

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './augur.dev.db',
    },
    seeds: {
      directory: './src/seeds/test'
    },
    migrations: {
      directory: './src/migrations'
    }
  },
  build: {
    client: 'sqlite3',
    connection: {
      filename: augurDbPath,
    },
    seeds: {
      directory: './build/seeds/test'
    },
    migrations: {
      directory: './build/migrations'
    }
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    seeds: {
      directory: './build/seeds/test'
    },
    migrations: {
      directory: './build/migrations'
    },
    useNullAsDefault: true
  }
};
