import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE outcomes (
      "marketId" varchar(42) NOT NULL,
      outcome integer NOT NULL CONSTRAINT "nonnegativeOutcomeOutcome" CHECK ("nonnegativeOutcomeOutcome" >= 0),
      price numeric NOT NULL,
      volume numeric NOT NULL CONSTRAINT "nonnegativeOutcomeVolume" CHECK ("nonnegativeOutcomeVolume" >= 0),
      description text,
      UNIQUE("marketId", outcome)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes");
};
