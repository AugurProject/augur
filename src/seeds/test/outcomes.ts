import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("outcomes").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      price: "0.125",
      volume: "100",
      description: "outcome 0",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 1,
      price: "0.125",
      volume: "100",
      description: "outcome 1",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 2,
      price: "0.125",
      volume: "100",
      description: "outcome 2",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 3,
      price: "0.125",
      volume: "100",
      description: "outcome 3",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 4,
      price: "0.125",
      volume: "100",
      description: "outcome 4",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 5,
      price: "0.125",
      volume: "100",
      description: "outcome 5",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 6,
      price: "0.125",
      volume: "100",
      description: "outcome 6",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 7,
      price: "0.125",
      volume: "100",
      description: "outcome 7",
    }, {
      marketID: "0x0000000000000000000000000000000000000002",
      outcome: 0,
      price: "0.5",
      volume: "1000",
      description: null,
    }, {
      marketID: "0x0000000000000000000000000000000000000002",
      outcome: 1,
      price: "0.5",
      volume: "1000",
      description: null,
    }, {
      marketID: "0x0000000000000000000000000000000000000003",
      outcome: 0,
      price: "0.5",
      volume: "10",
      description: null,
    }, {
      marketID: "0x0000000000000000000000000000000000000003",
      outcome: 1,
      price: "0.5",
      volume: "10",
      description: null,
    }];
    return knex.batchInsert("outcomes", seedData, seedData.length);
  });
};
