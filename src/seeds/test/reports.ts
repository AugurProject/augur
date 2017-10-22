import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("reports").del().then((): void => {
    // Inserts seed entries
    knex.batchInsert("reports", [{
      reporter: "0x0000000000000000000000000000000000000021",
      marketID: "0x0000000000000000000000000000000000000002",
      reportingToken: "0x0000000000000000001000000000000000000001",
      amountStaked: 17,
      payout1: 0,
      payout2: 2,
      isInvalid: 0,
    }, {
      reporter: "0x0000000000000000000000000000000000000022",
      marketID: "0x0000000000000000000000000000000000000002",
      reportingToken: "0x0000000000000000001000000000000000000002",
      amountStaked: 41,
      payout1: 2,
      payout2: 0,
      isInvalid: 0,
    }, {
      reporter: "0x0000000000000000000000000000000000000023",
      marketID: "0x0000000000000000000000000000000000000002",
      reportingToken: "0x0000000000000000001000000000000000000002",
      amountStaked: 222,
      payout1: 1,
      payout2: 1,
      isInvalid: 1,
    }], 1000);
  });
};
