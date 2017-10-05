import * as Knex from "knex";
import Promise = require("bluebird");

exports.seed = function (knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("transfers").del()
        .then(() => {
          // Inserts seed entries
          return knex.raw(`INSERT INTO transfers
            (transaction_hash, log_index, sender, recipient, token, value, block_number)
            VALUES (
              '0x00000000000000000000000000000000000000000000000000000000deadbeef',
              0,
              '0x0000000000000000000000000000000000000b0b',
              '0x000000000000000000000000000000000000d00d',
              '0x1000000000000000000000000000000000000000',
              10,
              1400000
            ), (
              '0x00000000000000000000000000000000000000000000000000000000d3adb33f',
              0,
              '0x000000000000000000000000000000000000d00d',
              '0x0000000000000000000000000000000000000b0b',
              '0x1000000000000000000000000000000000000000',
              2,
              1400001
            ), (
              '0x00000000000000000000000000000000000000000000000000000000deadb33f',
              1,
              '0x0000000000000000000000000000000000000b0b',
              '0x000000000000000000000000000000000000d00d',
              '0x7a305d9b681fb164dc5ad628b5992177dc66aec8',
              47,
              1400001
            )`);
        });
};
