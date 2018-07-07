import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("approvals").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE approvals (
      "transactionHash" varchar(66) NOT NULL,
      "logIndex" integer NOT NULL CONSTRAINT "nonnegativeApprovalLogIndex" CHECK ("logIndex" >= 0),
      owner varchar(66) NOT NULL,
      spender varchar(66) NOT NULL,
      token varchar(66) NOT NULL,
      value numeric NOT NULL CONSTRAINT "nonnegativeApprovalValue" CHECK (value >= 0),
      "blockNumber" integer NOT NULL CONSTRAINT "positiveApprovalBlockNumber" CHECK ("blockNumber" > 0),
      UNIQUE("transactionHash", "logIndex")
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("approvals");
};
