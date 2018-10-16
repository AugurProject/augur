"use strict";

var assign = require("lodash").assign;
var immutableDelete = require("immutable-delete");
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe address.
 * @param {function} callback Called after stake required has been retrieved.
 * @return {string} Amount of stake required for the designated reporter on this universe, as a base-10 string.
 */
function getStakeRequiredForDesignatedReporter(p, callback) {
  var universePayload = assign({}, immutableDelete(p, "universe"), { tx: assign({ to: p.universe, send: false }, p.tx) });
  api().Universe.getOrCacheDesignatedReportStake(universePayload, function (err, designatedReportStake) {
    if (err) return callback(err);
    callback(null, speedomatic.unfix(designatedReportStake, "string"));
  });
}

module.exports = getStakeRequiredForDesignatedReporter;
