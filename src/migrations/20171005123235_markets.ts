import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE markets (
      "marketID" varchar(66) PRIMARY KEY NOT NULL,
      universe varchar(66) NOT NULL,
      "marketType" varchar(11) NOT NULL CONSTRAINT "enumMarketTypes" CHECK ("marketType" = 'binary' OR "marketType" = 'categorical' OR "marketType" = 'scalar'),
      "numOutcomes" integer NOT NULL CONSTRAINT "positiveNumOutcomes" CHECK ("numOutcomes" > 0),
      "minPrice" numeric NOT NULL,
      "maxPrice" numeric NOT NULL CONSTRAINT "maxPriceGtMinPrice" CHECK ("maxPrice" > "minPrice"),
      "marketCreator" varchar(66) NOT NULL,
      "creationTime" integer NOT NULL CONSTRAINT "positiveMarketCreationTime" CHECK ("creationTime" > 0),
      "creationBlockNumber" integer NOT NULL CONSTRAINT "positiveMarketCreationBlockNumber" CHECK ("creationBlockNumber" > 0),
      "creationFee" numeric NOT NULL CONSTRAINT "nonnegativeCreationFee" CHECK ("creationFee" >= 0),
      "reportingFeeRate" numeric NOT NULL CONSTRAINT "nonnegativeReportingFeeRate" CHECK ("reportingFeeRate" >= 0),
      "marketCreatorFeeRate" numeric NOT NULL CONSTRAINT "nonnegativeMarketCreatorFeeRate" CHECK ("marketCreatorFeeRate" >= 0),
      "marketCreatorFeesCollected" numeric DEFAULT 0 CONSTRAINT "nonnegativeMarketCreatorFeesCollected" CHECK ("marketCreatorFeesCollected" >= 0),
      category varchar(255) NOT NULL,
      tag1 varchar(255),
      tag2 varchar(255),
      volume numeric NOT NULL CONSTRAINT "nonnegativeVolume" CHECK (volume >= 0),
      "sharesOutstanding" numeric NOT NULL CONSTRAINT "nonnegativeSharesOutstanding" CHECK ("sharesOutstanding" >= 0),
      "reportingWindow" varchar(66),
      "endTime" integer NOT NULL CONSTRAINT "positiveEndTime" CHECK ("endTime" > 0),
      "finalizationTime" integer,
      "marketStateID" integer,
      "shortDescription" varchar(1000) NOT NULL,
      "longDescription" text,
      "designatedReporter" varchar(66) NOT NULL,
      "designatedReportStake" numeric,
      "resolutionSource" text,
      "numTicks" integer NOT NULL,
      "consensusOutcome" integer,
      "isInvalid" boolean
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets");
};
