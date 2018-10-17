const path = require("path");

const augurDbPath = path.join(__dirname, "augur-test.db");

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
  test_file: {
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
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    seeds: {
      directory: path.resolve(__dirname, "./src/seeds/test"),
    },
    migrations: {
      directory: path.resolve(__dirname, "./src/migrations"),
    },
    useNullAsDefault: true,
  },
  pg: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: "./src/seeds/test",
    },
    migrations: {
      directory: "./src/migrations",
    },
  },
};
