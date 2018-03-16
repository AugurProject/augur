import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE markets (
      "marketId" varchar(66) PRIMARY KEY NOT NULL,
      universe varchar(66) NOT NULL,
      "marketType" varchar(11) NOT NULL CONSTRAINT "enumMarketTypes" CHECK ("marketType" = 'binary' OR "marketType" = 'categorical' OR "marketType" = 'scalar'),
      "numOutcomes" integer NOT NULL CONSTRAINT "positiveNumOutcomes" CHECK ("numOutcomes" > 0),
      "minPrice" numeric NOT NULL,
      "maxPrice" numeric NOT NULL CONSTRAINT "maxPriceGtMinPrice" CHECK ("maxPrice" > "minPrice"),
      "marketCreator" varchar(66) NOT NULL,
      "creationBlockNumber" integer NOT NULL CONSTRAINT "positiveMarketCreationBlockNumber" CHECK ("creationBlockNumber" > 0),
      "creationFee" numeric NOT NULL CONSTRAINT "nonnegativeCreationFee" CHECK ("creationFee" >= 0),
      "reportingFeeRate" numeric NOT NULL CONSTRAINT "nonnegativeReportingFeeRate" CHECK ("reportingFeeRate" >= 0),
      "marketCreatorFeeRate" numeric NOT NULL CONSTRAINT "nonnegativeMarketCreatorFeeRate" CHECK ("marketCreatorFeeRate" >= 0),
      "marketCreatorFeesClaimed" numeric DEFAULT 0 CONSTRAINT "nonnegativeMarketCreatorFeesClaimed" CHECK ("marketCreatorFeesClaimed" >= 0),
      "marketCreatorFeesCollected" numeric DEFAULT 0 CONSTRAINT "nonnegativeMarketCreatorFeesCollected" CHECK ("marketCreatorFeesCollected" >= 0),
      "initialReportSize" numeric DEFAULT NULL CONSTRAINT "nonnegativeIntitialReportSize" CHECK ("intitialReportSize" >= 0),
      category varchar(255) NOT NULL,
      tag1 varchar(255),
      tag2 varchar(255),
      volume numeric NOT NULL CONSTRAINT "nonnegativeVolume" CHECK ("nonnegativeVolume" >= 0),
      "sharesOutstanding" numeric NOT NULL CONSTRAINT "nonnegativeSharesOutstanding" CHECK ("sharesOutstanding" >= 0),
      "feeWindow" varchar(66),
      "endTime" integer NOT NULL CONSTRAINT "positiveEndTime" CHECK ("endTime" > 0),
      "finalizationTime" integer,
      "marketStateId" integer,
      "shortDescription" text NOT NULL,
      "longDescription" text,
      "scalarDenomination" text,
      "designatedReporter" varchar(66) NOT NULL,
      "designatedReportStake" numeric,
      "resolutionSource" text,
      "numTicks" integer NOT NULL,
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
