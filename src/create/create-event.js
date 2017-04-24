"use strict";

var abi = require("augur-abi");
var api = require("../api");
var isObject = require("../utils/is-object");

function createEvent(branch, description, expDate, minValue, maxValue, numOutcomes, resolution, onSent, onSuccess, onFailed) {
  if (isObject(branch)) {
    description = branch.description;
    minValue = branch.minValue;
    maxValue = branch.maxValue;
    numOutcomes = branch.numOutcomes;
    expDate = branch.expDate;
    resolution = branch.resolution;
    onSent = branch.onSent;
    onSuccess = branch.onSuccess;
    onFailed = branch.onFailed;
    branch = branch.branch;
  }
  if (description) description = description.trim();
  if (resolution) resolution = resolution.trim();
  return api().CreateMarket.createEvent({
    branch: branch,
    description: description,
    expDate: parseInt(expDate, 10),
    minValue: abi.fix(minValue, "hex"),
    maxValue: abi.fix(maxValue, "hex"),
    numOutcomes: numOutcomes,
    resolution: resolution || "",
    onSent: onSent,
    onSuccess: onSuccess,
    onFailed: onFailed
  });
}

module.exports = createEvent;
