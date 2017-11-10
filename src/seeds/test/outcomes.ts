import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("outcomes").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 1,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 2,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 3,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 4,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 5,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 6,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 7,
      price: "0.125",
      sharesOutstanding: "100",
    }, {
      marketID: "0x0000000000000000000000000000000000000002",
      outcome: 0,
      price: "0.5",
      sharesOutstanding: "1000",
    }, {
      marketID: "0x0000000000000000000000000000000000000002",
      outcome: 1,
      price: "0.5",
      sharesOutstanding: "1000",
    }, {
      marketID: "0x0000000000000000000000000000000000000003",
      outcome: 0,
      price: "0.5",
      sharesOutstanding: "10",
    }, {
      marketID: "0x0000000000000000000000000000000000000003",
      outcome: 1,
      price: "0.5",
      sharesOutstanding: "10",
    }];
    return knex.batchInsert("outcomes", seedData, seedData.length);
  });
};
