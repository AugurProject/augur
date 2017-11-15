"use strict";

module.exports = {
  createMarket: require("./create-market"),
  createBinaryMarket: require("./create-binary-market"),
  createCategoricalMarket: require("./create-categorical-market"),
  createScalarMarket: require("./create-scalar-market"),
  getMarketCreationCost: require("./get-market-creation-cost"),
  getMarketCreationCostBreakdown: require("./get-market-creation-cost-breakdown"),
};
