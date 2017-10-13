import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("categories").del()
    .then((): PromiseLike<any> => {
      // Inserts seed entries
      return knex.raw(`INSERT INTO categories
            (category, popularity, universe)
            VALUES
            ('test category', 0, '0x000000000000000000000000000000000000000b'),
            ('politics', 5000, '0x000000000000000000000000000000000000000b'),
            ('ethereum', 1000, '0x000000000000000000000000000000000000000b'),
            ('augur', 500, '0x000000000000000000000000000000000000000b'),
            ('finance', 12345, '0x000000000000000000000000000000000000000b')`);
    });
};
