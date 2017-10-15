import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("transfers").del()
    .then((): PromiseLike<any> => {
      // Inserts seed entries
      return knex.raw(`INSERT INTO transfers
            (transactionHash, logIndex, sender, recipient, token, value, blockNumber)
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
