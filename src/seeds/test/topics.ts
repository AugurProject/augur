import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("topics").del()
    .then(() => {
      // Inserts seed entries
      return knex.raw(`INSERT INTO topics
            (topic, popularity, universe)
            VALUES
            ('test topic', 0, '0x000000000000000000000000000000000000000b'),
            ('politics', 5000, '0x000000000000000000000000000000000000000b'),
            ('ethereum', 1000, '0x000000000000000000000000000000000000000b'),
            ('augur', 500, '0x000000000000000000000000000000000000000b'),
            ('finance', 12345, '0x000000000000000000000000000000000000000b')`);
    });
};
