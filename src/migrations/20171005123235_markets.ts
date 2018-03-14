import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE markets (
      "marketId" varchar(66) PRIMARY KEY NOT NULL,
      universe varchar(66) NOT NULL,
      "marketType" varchar(11) NOT NULL CONSTRAINT "enumMarketTypes" CHECK ("marketType" = 'binary' OR "marketType" = 'categorical' OR "marketType" = 'scalar'),
      "numOutcomes" integer NOT NULL CONSTRAINT "positiveNumOutcomes" CHECK ("numOutcomes" > 0),
      "minPrice" VARCHAR(255) NOT NULL,
      "maxPrice" VARCHAR(255) NOT NULL,
      "marketCreator" varchar(66) NOT NULL,
      "creationBlockNumber" integer NOT NULL CONSTRAINT "positiveMarketCreationBlockNumber" CHECK ("creationBlockNumber" > 0),
      "creationFee" VARCHAR(255) NOT NULL,
      "reportingFeeRate" VARCHAR(255) NOT NULL,
      "marketCreatorFeeRate" VARCHAR(255) NOT NULL,
      "marketCreatorFeesClaimed" VARCHAR(255) DEFAULT "0",
      "marketCreatorFeesCollected" VARCHAR(255) DEFAULT "0",
      "initialReportSize" VARCHAR(255) DEFAULT "0",
      category varchar(255) NOT NULL,
      tag1 varchar(255),
      tag2 varchar(255),
      volume VARCHAR(255) NOT NULL,
      "sharesOutstanding" VARCHAR(255) NOT NULL,
      "feeWindow" varchar(66),
      "endTime" integer NOT NULL CONSTRAINT "positiveEndTime" CHECK ("endTime" > 0),
      "finalizationTime" integer,
      "marketStateId" integer,
      "shortDescription" text NOT NULL,
      "longDescription" text,
      "designatedReporter" varchar(66) NOT NULL,
      "designatedReportStake" VARCHAR(255),
      "resolutionSource" text,
      "numTicks" VARCHAR(255) NOT NULL,
      "consensusPayoutId" integer,
      "reportingRoundsCompleted" integer NOT NULL DEFAULT 0,
      "isInvalid" boolean
    )`)
    .raw("CREATE INDEX endTime ON markets (endTime)");
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets");
};
