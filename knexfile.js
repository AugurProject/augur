module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './augur.db',
    },
    seeds: {
      directory: './seeds/dev'
    }
  }
};
