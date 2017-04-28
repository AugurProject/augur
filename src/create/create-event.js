"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");

// { branch, description, expDate, minValue, maxValue, numOutcomes, resolution, onSent, onSuccess, onFailed }
function createEvent(p) {
  if (p.description) p.description = p.description.trim();
  if (p.resolution) p.resolution = p.resolution.trim();
  return api().CreateMarket.createEvent(assign({}, p, {
    expDate: parseInt(p.expDate, 10),
    minValue: abi.fix(p.minValue, "hex"),
    maxValue: abi.fix(p.maxValue, "hex"),
    resolution: p.resolution || ""
  }));
}

module.exports = createEvent;
