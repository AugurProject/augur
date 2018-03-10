import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE markets (
      "marketId" varchar(66) PRIMARY KEY NOT NULL,
      universe varchar(66) NOT NULL,
      "marketType" varchar(11) NOT NULL CONSTRAINT "enumMarketTypes" CHECK ("marketType" = 'binary' OR "marketType" = 'categorical' OR "marketType" = 'scalar'),
      "numOutcomes" integer NOT NULL CONSTRAINT "positiveNumOutcomes" CHECK ("numOutcomes" > 0),
      "minPrice" varchar(18) NOT NULL,
      "maxPrice" varchar(18) NOT NULL,
      "marketCreator" varchar(66) NOT NULL,
      "creationBlockNumber" integer NOT NULL CONSTRAINT "positiveMarketCreationBlockNumber" CHECK ("creationBlockNumber" > 0),
      "creationFee" varchar(18) NOT NULL,
      "reportingFeeRate" numeric NOT NULL CONSTRAINT "nonnegativeReportingFeeRate" CHECK ("reportingFeeRate" >= 0),
      "marketCreatorFeeRate" numeric NOT NULL CONSTRAINT "nonnegativeMarketCreatorFeeRate" CHECK ("marketCreatorFeeRate" >= 0),
      "marketCreatorFeesClaimed" varchar(18) DEFAULT "0",
      "marketCreatorFeesCollected" varchar(18) DEFAULT "0",
      "initialReportSize" varchar(18) DEFAULT "0",
      category varchar(255) NOT NULL,
      tag1 varchar(255),
      tag2 varchar(255),
      volume varchar(18) NOT NULL,
      "sharesOutstanding" varchar(18) NOT NULL,
      "feeWindow" varchar(66),
      "endTime" integer NOT NULL CONSTRAINT "positiveEndTime" CHECK ("endTime" > 0),
      "finalizationTime" integer,
      "marketStateId" integer,
      "shortDescription" text NOT NULL,
      "longDescription" text,
      "designatedReporter" varchar(66) NOT NULL,
      "designatedReportStake" varchar(18),
      "resolutionSource" text,
      "numTicks" varchar(18) NOT NULL,
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
