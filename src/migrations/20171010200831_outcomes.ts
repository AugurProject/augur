import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE outcomes (
      "marketID" varchar(42) NOT NULL,
      outcome integer NOT NULL CONSTRAINT "nonnegativeOutcomeOutcome" CHECK (outcome >= 0),
      price numeric NOT NULL,
      volume numeric NOT NULL NOT NULL CONSTRAINT "nonnegativeOutcomeVolume" CHECK ("nonnegativeOutcomeVolume" >= 0),
      description text,
      UNIQUE("marketID", outcome)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes");
};
