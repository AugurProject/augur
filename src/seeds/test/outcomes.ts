import * as Knex from "knex";
import Promise = require("bluebird");

exports.seed = (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("outcomes").del().then((): void => {
    // Inserts seed entries
    knex.batchInsert("outcomes", [{
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 1,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 2,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 3,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 4,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 5,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 6,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 7,
      price: "0.125",
      shares_outstanding: "100"
    }, {
      market_id: "0x0000000000000000000000000000000000000002",
      outcome: 0,
      price: "0.5",
      shares_outstanding: "1000"
    }, {
      market_id: "0x0000000000000000000000000000000000000002",
      outcome: 1,
      price: "0.5",
      shares_outstanding: "1000"
    }, {
      market_id: "0x0000000000000000000000000000000000000003",
      outcome: 0,
      price: "0.5",
      shares_outstanding: "10"
    }, {
      market_id: "0x0000000000000000000000000000000000000003",
      outcome: 1,
      price: "0.5",
      shares_outstanding: "10"
    }], 1000);
  });
};
