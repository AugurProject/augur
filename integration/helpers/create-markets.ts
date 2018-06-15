"use strict";

export const createYesNoMarket = async () => {
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  const currentTimestamp: number = await page.evaluate(() => window.integrationHelpers.getCurrentTimestamp());

  const daysToAdjust = 2 * 86400000;
  const now = new Date(currentTimestamp)
  const marketDate = new Date(now.valueOf() + (daysToAdjust))
  const endTime = marketDate.getTime() / 1000
  const marketDesc = 'New YesNo Market ' + endTime
  const marketEndTime = { timestamp: endTime}
  const newMarket =
  {
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
    tickSize: "0.0001",
    type: "yesNo",
  }
  return await page.evaluate((market) => window.integrationHelpers.createMarket(market), newMarket);
};
