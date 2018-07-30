import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE markets (
      "marketId" varchar(66) PRIMARY KEY NOT NULL,
      universe varchar(66) NOT NULL,
      "marketType" varchar(11) NOT NULL CONSTRAINT "enumMarketTypes" CHECK ("marketType" = 'yesNo' OR "marketType" = 'categorical' OR "marketType" = 'scalar'),
      "numOutcomes" integer NOT NULL CONSTRAINT "positiveNumOutcomes" CHECK ("numOutcomes" > 0),
      "minPrice" VARCHAR(255) NOT NULL,
      "maxPrice" VARCHAR(255) NOT NULL,
      "marketCreator" varchar(66) NOT NULL,
      "creationBlockNumber" integer NOT NULL CONSTRAINT "positiveMarketCreationBlockNumber" CHECK ("creationBlockNumber" > 0),
      "creationFee" varchar(255) NOT NULL CONSTRAINT "nonnegativeCreationFee" CHECK (ltrim("creationFee", '-') = "creationFee"),
      "reportingFeeRate" varchar(255) NOT NULL CONSTRAINT "nonnegativeReportingFeeRate" CHECK (ltrim("reportingFeeRate", '-') = "reportingFeeRate"),
      "marketCreatorFeeRate" varchar(255) NOT NULL CONSTRAINT "nonnegativeMarketCreatorFeeRate" CHECK (ltrim("marketCreatorFeeRate", '-') = "marketCreatorFeeRate"),
      "marketCreatorFeesBalance" VARCHAR(255) DEFAULT "0" CONSTRAINT "nonnegativeMarketCreatorFeesBalance" CHECK (ltrim("marketCreatorFeesBalance", '-') = "marketCreatorFeesBalance"),
      "marketCreatorMailbox" VARCHAR(255) NOT NULL,
      "marketCreatorMailboxOwner" VARCHAR(255) NOT NULL,
      "initialReportSize" VARCHAR(255) DEFAULT "0",
      category varchar(255) NOT NULL,
      tag1 varchar(255),
      tag2 varchar(255),
      volume varchar(255) NOT NULL CONSTRAINT "nonnegativeVolume" CHECK (ltrim("volume", '-') = "volume"),
      "sharesOutstanding" varchar(255) NOT NULL CONSTRAINT "nonnegativeSharesOutstanding" CHECK (ltrim("sharesOutstanding", '-') = "sharesOutstanding"),
      "feeWindow" varchar(66),
      "endTime" integer NOT NULL CONSTRAINT "positiveEndTime" CHECK ("endTime" > 0),
      "finalizationBlockNumber" integer,
      "forking" boolean DEFAULT 0,
      "needsMigration" boolean DEFAULT 0,
      "marketStateId" integer,
      "shortDescription" text NOT NULL,
      "longDescription" text,
      "scalarDenomination" text,
      "designatedReporter" varchar(66) NOT NULL,
      "designatedReportStake" varchar(255) CONSTRAINT "nonnegativeDesignatedReportStake" CHECK (ltrim("designatedReportStake", '-') = "designatedReportStake"),
      "resolutionSource" text,
      "numTicks" varchar(255) NOT NULL CONSTRAINT "nonnegativeNumTicks" CHECK (ltrim("numTicks", '-') = "numTicks"),
      "consensusPayoutId" integer,
      "disputeRounds" integer,
      "isInvalid" boolean,
      "needsDisavowal" boolean DEFAULT 0
    )`)
    .raw("CREATE INDEX endTime ON markets (endTime)");
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets");
};
