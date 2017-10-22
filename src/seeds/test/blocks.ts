import * as Knex from "knex";
import Promise = require("bluebird");

exports.seed = (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("blocks").del().then((): void => {
    // Inserts seed entries
    knex.batchInsert("blocks", [{
      blockNumber: 7,
      blockTimestamp: 10000000,
    }, {
      blockNumber: 8,
      blockTimestamp: 10000015,
    }], 1000);
  });
};
