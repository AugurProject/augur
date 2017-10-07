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
  test: {
    client: 'sqlite3',
    connection: {
      filename: './augur.test.db',
    },
    seeds: {
      directory: './build/seeds/test'
    },
    migrations: {
      directory: './build/migrations'
    }
  }
};
