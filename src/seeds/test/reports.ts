import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("reports").del().then(() => {
    return knex.raw(`INSERT INTO reports
      (reporter, marketID, reportingToken, amountStaked, payout1, payout2, isInvalid)
      VALUES (
        '0x0000000000000000000000000000000000000021',
        '0x0000000000000000000000000000000000000002',
        '0x0000000000000000001000000000000000000001',
        17,
        0,
        2,
        0
      ), (
        '0x0000000000000000000000000000000000000022',
        '0x0000000000000000000000000000000000000002',
        '0x0000000000000000001000000000000000000002',
        41,
        2,
        0,
        0
      ), (
        '0x0000000000000000000000000000000000000023',
        '0x0000000000000000000000000000000000000002',
        '0x0000000000000000001000000000000000000002',
        222,
        1,
        1,
        1
      )`);
  });
};
