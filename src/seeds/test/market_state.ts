import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("market_state").del().then(async (): Promise<any> => {
    // Inserts seed entries
    return knex.batchInsert("market_state", [{
      marketStateId: 1,
      marketId: "0x0000000000000000000000000000000000000001",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400000,
    }, {
      marketStateId: 2,
      marketId: "0x0000000000000000000000000000000000000002",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400001,
    }, {
      marketStateId: 3,
      marketId: "0x0000000000000000000000000000000000000003",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateId: 4,
      marketId: "0x0000000000000000000000000000000000000011",
      reportingState: "CROWDSOURCING_DISPUTE",
      blockNumber: 1400002,
    }, {
      marketStateId: 5,
      marketId: "0x0000000000000000000000000000000000000012",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateId: 6,
      marketId: "0x0000000000000000000000000000000000000013",
      reportingState: "AWAITING_FINALIZATION",
      blockNumber: 1400002,
    }, {
      marketStateId: 7,
      marketId: "0x0000000000000000000000000000000000000014",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateId: 8,
      marketId: "0x0000000000000000000000000000000000000015",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateId: 9,
      marketId: "0x0000000000000000000000000000000000000016",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateId: 10,
      marketId: "0x0000000000000000000000000000000000000017",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400002,
    }, {
      marketStateId: 11,
      marketId: "0x0000000000000000000000000000000000000018",
      reportingState: "CROWDSOURCING_DISPUTE",
      blockNumber: 1400002,
    }, {
      marketStateId: 12,
      marketId: "0x0000000000000000000000000000000000000019",
      reportingState: "FINALIZED",
      blockNumber: 1400002,
    }, {
      marketStateId: 13,
      marketId: "0x0000000000000000000000000000000000000019",
      reportingState: "DESIGNATED_REPORTING",
      blockNumber: 1400000,
    }, {
      marketStateId: 14,
      marketId: "0x0000000000000000000000000000000000000019",
      reportingState: "CROWDSOURCING_DISPUTE",
      blockNumber: 1400001,
    }, {
      marketStateId: 15,
      marketId: "0x0000000000000000000000000000000000000211",
      reportingState: "CROWDSOURCING_DISPUTE",
      blockNumber: 1500001,
    }, {
      marketStateId: 16,
      marketId: "0x0000000000000000000000000000000000000222",
      reportingState: "PRE_REPORTING",
      blockNumber: 1500001,
    }, {
      marketStateId: 17,
      marketId: "0x00000000000000000000000000000000000000f1",
      reportingState: "FINALIZED",
      blockNumber: 1500001,
    }], 1000);
  });
};
