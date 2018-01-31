const { augurDbPath } = require("./config.json");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./augur.dev.db",
    },
    seeds: {
      directory: "./src/seeds/test",
    },
    migrations: {
      directory: "./src/migrations",
    },
    useNullAsDefault: true,
  },
  build: {
    client: "sqlite3",
    connection: {
      filename: augurDbPath,
    },
    seeds: {
      directory: "./build/seeds/test",
    },
    migrations: {
      directory: "./build/migrations",
    },
    useNullAsDefault: true,
  },
  build_postgres: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: "./build/seeds/test",
    },
    migrations: {
      directory: "./build/migrations",
    },
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    seeds: {
      directory: "./build/seeds/test",
    },
    migrations: {
      directory: "./build/migrations",
    },
    useNullAsDefault: true,
  },
};
