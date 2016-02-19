"use strict";

var BigNumber = require("bignumber.js");
var utils = require("../app/libs/utilities");

module.exports = {

    parseMarketInfo: function (info, blockNumber, account) {
        info.id = new BigNumber(info._id);
        info.endDate = utils.blockToDate(info.endDate, blockNumber);
        info.creationBlock = utils.blockToDate(info.creationBlock, blockNumber);
        info.price = new BigNumber(info.price);
        info.tradingFee = new BigNumber(info.tradingFee);
        info.creationFee = new BigNumber(info.creationFee);
        info.traderCount = new BigNumber(info.traderCount);
        info.alpha = new BigNumber(info.alpha);
        info.tradingPeriod = new BigNumber(info.tradingPeriod);
        var traderId = info.participants[account.address];
        if (traderId) info.traderId = new BigNumber(traderId);
        for (var i = 0; i < info.numEvents; ++i) {
            info.events[i].endDate = utils.blockToDate(info.events[i].endDate);
        }
        for (i = 0; i < info.numOutcomes; ++i) {
            if (info.outcomes[i].outstandingShares) {
                info.outcomes[i].outstandingShares = new BigNumber(info.outcomes[i].outstandingShares);
            } else {
                info.outcomes[i].outstandingShares = new BigNumber(0);
            }
            if (info.outcomes[i].shares[account.address]) {
                info.outcomes[i].sharesHeld = new BigNumber(info.outcomes[i].shares[account.address]);
            } else {
                info.outcomes[i].sharesHeld = new BigNumber(0);
            }
            info.outcomes[i].pendingShares = new BigNumber(0);
            info.outcomes[i].price = new BigNumber(info.outcomes[i].price);
        }
        info.loaded = true;
        return info;
    }

};
