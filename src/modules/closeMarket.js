/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");

module.exports = {

    closeMarket: function (branch, market, onSent, onSuccess, onFailed) {
        if (branch.constructor === Object && branch.branch) {
            market = branch.market;
            onSent = branch.onSent;
            onSuccess = branch.onSuccess;
            onFailed = branch.onFailed;
            branch = branch.branch;
        }
        var tx = clone(this.tx.closeMarket.closeMarket);
        tx.params = [branch, market];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }

};
