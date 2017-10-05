module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './augur.db',
    },
    seeds: {
      directory: './build/seeds/dev'
    },
    migrations: {
      directory: './build/migrations'
    }
  }
};
