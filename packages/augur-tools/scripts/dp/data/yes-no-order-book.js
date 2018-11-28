"use strict";

module.exports = {
  buy: { 1: require("./single-outcome-bids") },
  sell: { 1: require("./single-outcome-asks") },
};
