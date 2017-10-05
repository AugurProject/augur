import * as Knex from "knex";
import Promise = require("bluebird");

exports.seed = function (knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("balances").del()
        .then(() => {
          return knex.raw(`INSERT INTO balances
            (owner, token, balance)
            VALUES
            ('0x0000000000000000000000000000000000000b0b', '0x7a305d9b681fb164dc5ad628b5992177dc66aec8', 1000000000000000000),
            ('0x000000000000000000000000000000000000d00d', '0x7a305d9b681fb164dc5ad628b5992177dc66aec8', 500000000000000000),
            ('0x0000000000000000000000000000000000000b0b', '0x1000000000000000000000000000000000000000', 7000000000000000000),
            ('0x000000000000000000000000000000000000d00d', '0x1000000000000000000000000000000000000000', 3500000000000000000)`
          );
        });
};
