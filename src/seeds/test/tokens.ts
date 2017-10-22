import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("tokens").del().then((): void => {
    // Inserts seed entries
    knex.batchInsert("tokens", [{
      contractAddress: "ETH",
      symbol: "ETH",
      market: null,
      outcome: null,
    }, {
      contractAddress: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
      symbol: "REP",
      market: null,
      outcome: null,
    }, {
      contractAddress: "0x2000000000000000000000000000000000000000",
      symbol: "shares",
      market: "0x0000000000000000000000000000000000000001",
      outcome: 1,
    }, {
      contractAddress: "0x1000000000000000000000000000000000000000",
      symbol: "shares",
      market: "0x0000000000000000000000000000000000000001",
      outcome: 0,
    }], 1000);
  });
};
