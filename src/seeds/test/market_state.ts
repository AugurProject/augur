import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("market_state").del().then(async (): Promise<any> => {
    // Inserts seed entries
    return knex.batchInsert("market_state", [{
      marketStateID: 1,
      marketID: "0x0000000000000000000000000000000000000001",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400000,
    }, {
      marketStateID: 2,
      marketID: "0x0000000000000000000000000000000000000002",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400001,
    }, {
      marketStateID: 3,
      marketID: "0x0000000000000000000000000000000000000003",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateID: 4,
      marketID: "0x0000000000000000000000000000000000000011",
      reportingState: "FIRST_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateID: 5,
      marketID: "0x0000000000000000000000000000000000000012",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateID: 6,
      marketID: "0x0000000000000000000000000000000000000013",
      reportingState: "AWAITING_FINALIZATION",
      blockNumber: 1400002,
    }, {
      marketStateID: 7,
      marketID: "0x0000000000000000000000000000000000000014",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateID: 8,
      marketID: "0x0000000000000000000000000000000000000015",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateID: 9,
      marketID: "0x0000000000000000000000000000000000000016",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateID: 10,
      marketID: "0x0000000000000000000000000000000000000017",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateID: 11,
      marketID: "0x0000000000000000000000000000000000000018",
      reportingState: "FIRST_REPORTING",
      blockNumber: 1400002,
    },, {
      marketStateID: 12,
      marketID: "0x0000000000000000000000000000000000000019",
      reportingState: "FINALIZED",
      blockNumber: 1400002,
    }], 1000);
  });
};
