import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("outcomes").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const marketOutcomeCounts: {[marketId: string]: {numOutcomes: number, price: string, volume: string }} = {
      "0x0000000000000000000000000000000000000001": {numOutcomes: 8, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000002": {numOutcomes: 2, price: "0.5", volume: "1000"},
      "0x0000000000000000000000000000000000000003": {numOutcomes: 2, price: "0.5", volume: "10"},
      "0x0000000000000000000000000000000000000011": {numOutcomes: 8, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000012": {numOutcomes: 2, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000013": {numOutcomes: 2, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000014": {numOutcomes: 5, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000015": {numOutcomes: 4, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000016": {numOutcomes: 7, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000017": {numOutcomes: 7, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000018": {numOutcomes: 7, price: "0.125", volume: "100"},
      "0x0000000000000000000000000000000000000019": {numOutcomes: 5, price: "0.125", volume: "100"},
    };

    const seedData: any = [];
    Object.keys(marketOutcomeCounts).forEach((marketId) => {
      const { numOutcomes, price, volume } = marketOutcomeCounts[marketId];
      Array(numOutcomes).fill(0).forEach((_, i) => {
        seedData.push({
          marketId,
          volume,
          price,
          outcome: i,
          description: "outcome " + i,
        });
      });
    });

    return knex.batchInsert("outcomes", seedData, seedData.length);
  });
};
