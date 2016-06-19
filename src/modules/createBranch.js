/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    createBranch: function (description, periodLength, parent, tradingFee, oracleOnly, onSent, onSuccess, onFailed) {
        var self = this;
        if (description && description.parent) {
            periodLength = description.periodLength;
            parent = description.parent;
            tradingFee = description.tradingFee;
            oracleOnly = description.oracleOnly;
            if (description.onSent) onSent = description.onSent;
            if (description.onSuccess) onSuccess = description.onSuccess;
            if (description.onFailed) onFailed = description.onFailed;
            description = description.description;
        }
        oracleOnly = oracleOnly || 0;
        return this.createSubbranch({
            description: description,
            periodLength: periodLength,
            parent: parent,
            tradingFee: tradingFee,
            oracleOnly: oracleOnly,
            onSent: onSent,
            onSuccess: function (response) {
                response.branchID = utils.sha3([
                    0,
                    response.from,
                    "0x2f0000000000000000",
                    periodLength,
                    parseInt(response.blockNumber),
                    abi.hex(parent),
                    parseInt(abi.fix(tradingFee, "hex")),
                    oracleOnly,
                    new Buffer(description, "utf8")
                ]);
                onSuccess(response);
            },
            onFailed: onFailed
        });
    },

    createSubbranch: function (description, periodLength, parent, tradingFee, oracleOnly, onSent, onSuccess, onFailed) {
        if (description && description.parent) {
            periodLength = description.periodLength;
            parent = description.parent;
            tradingFee = description.tradingFee;
            oracleOnly = description.oracleOnly;
            if (description.onSent) onSent = description.onSent;
            if (description.onSuccess) onSuccess = description.onSuccess;
            if (description.onFailed) onFailed = description.onFailed;
            description = description.description;
        }
        oracleOnly = oracleOnly || 0;
        var tx = clone(this.tx.createSubbranch);
        tx.params = [
            description,
            periodLength,
            parent,
            abi.fix(tradingFee, "hex"),
            oracleOnly
        ];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
