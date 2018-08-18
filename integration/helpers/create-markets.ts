"use strict";
import BigNumber from "bignumber.js";

export const createYesNoMarket = async (address: string = "") => {
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  const currentTimestamp: number = await page.evaluate(() =>
    window.integrationHelpers.getCurrentTimestamp()
  );

  const daysToAdjust = 2 * 86400000;
  const now = new Date(currentTimestamp);
  const marketDate = new Date(now.valueOf() + daysToAdjust);
  const endTime = marketDate.getTime() / 1000;
  const marketDesc = "New YesNo Testing Market " + endTime;
  const marketEndTime = { timestamp: endTime };
  const newMarket = {
    category: "space",
    description: marketDesc,
    designatedReporterAddress: address,
    designatedReporterType:
      address !== ""
        ? "DESIGNATED_REPORTER_SPECIFIC"
        : "DESIGNATED_REPORTER_SELF",
    endTime: marketEndTime,
    expirySourceType: "EXPIRY_SOURCE_GENERIC",
    orderBook: {},
    orderBookSeries: {},
    orderBookSorted: {},
    settlementFee: 0,
    tag1: "",
    tag2: "",
    tickSize: "0.0001",
    type: "yesNo"
  };
  return await page.evaluate(
    market => window.integrationHelpers.createMarket(market),
    newMarket
  );
};

export const createCategoricalMarket = async (outcomeNum: number) => {
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  const currentTimestamp: number = await page.evaluate(() =>
    window.integrationHelpers.getCurrentTimestamp()
  );

  const daysToAdjust = 2 * 86400000;
  const now = new Date(currentTimestamp);
  const marketDate = new Date(now.valueOf() + daysToAdjust);
  const endTime = marketDate.getTime() / 1000;
  const marketDesc = "New Categorical Testing Market " + endTime;
  const marketEndTime = { timestamp: endTime };
  const outcomes = Array.from(
    new Array(outcomeNum),
    (val, index) => "outcome_" + (index + 1).toString()
  );
  const newMarket = {
    category: "space",
    description: marketDesc,
    designatedReporterAddress: "",
    designatedReporterType: "DESIGNATED_REPORTER_SELF",
    endTime: marketEndTime,
    expirySourceType: "EXPIRY_SOURCE_GENERIC",
    orderBook: {},
    orderBookSeries: {},
    orderBookSorted: {},
    settlementFee: 0,
    outcomes,
    tag1: "",
    tag2: "",
    tickSize: "0.0001",
    type: "categorical"
  };
  return await page.evaluate(
    market => window.integrationHelpers.createMarket(market),
    newMarket
  );
};

export const createScalarMarket = async () => {
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  const currentTimestamp: number = await page.evaluate(() =>
    window.integrationHelpers.getCurrentTimestamp()
  );

  const daysToAdjust = 2 * 86400000;
  const now = new Date(currentTimestamp);
  const marketDate = new Date(now.valueOf() + daysToAdjust);
  const endTime = marketDate.getTime() / 1000;
  const marketDesc = "New Scalar Testing Market " + endTime;
  const marketEndTime = { timestamp: endTime };
  const newMarket = {
    category: "space",
    description: marketDesc,
    designatedReporterAddress: "",
    designatedReporterType: "DESIGNATED_REPORTER_SELF",
    endTime: marketEndTime,
    expirySourceType: "EXPIRY_SOURCE_GENERIC",
    orderBook: {},
    orderBookSeries: {},
    orderBookSorted: {},
    settlementFee: 0,
    tag1: "",
    tag2: "",
    tickSize: "0.01",
    scalarBigNum: new BigNumber(10),
    scalarSmallNum: new BigNumber(-10),
    type: "scalar"
  };
  return await page.evaluate(
    market => window.integrationHelpers.createMarket(market),
    newMarket
  );
};
