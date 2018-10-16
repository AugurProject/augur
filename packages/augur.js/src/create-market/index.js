"use strict";

module.exports = {
  createYesNoMarket: require("./create-yes-no-market"),
  createCategoricalMarket: require("./create-categorical-market"),
  createScalarMarket: require("./create-scalar-market"),
  getMarketCreationCost: require("./get-market-creation-cost"),
  getMarketCreationCostBreakdown: require("./get-market-creation-cost-breakdown"),
  getMarketFromCreateMarketReceipt: require("./get-market-from-create-market-receipt"),
};
