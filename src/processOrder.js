/**
 * multiTrade: allows trading multiple outcomes in market.
 *
 * This method can result in multiple ethereum transactions per trade order (e.g. when user wants to buy 20 shares but
 * there are only 10 ask shares on order book, this method does trade() and buy()). Callbacks are called with
 * requestId to allow client map transactions to individual trade order
 *
 * Important fields in userTradeOrder are: sharesToSell, etherToBuy (total cost + fees) and limitPrice
 *
 * Algorithm:
 *
 * for each user trade order do this:
 * 1.1/ when user wants to buy: find all asks for that outcome which have less or equal price (user
 * doesn't want to pay more than specified). Sort asks by price ascendingly (lower prices first)
 * 1.2/ when user wants to sell: find all bids in order book for that outcome which have greater or equal price
 * (user doesn't want to sell at lower price than specified). Sort bids by price descendingly (higher prices first)
 *
 * 2/ if there are no orders to match, place order to order book. exit
 *
 * if there are suitable orders in order book let's trade:
 *
 * 3/ Trade user's buy order:
 *      3.1/ if user order was filled there is nothing to do. exit
 *      3.1/ if user order was partially filled we place bid for remaining shares to order book. exit
 *
 * 4/ Trade user's sell order:
 *      4.1/ if user has position, sell shares he owns:
 *          4.1.1/ if user order was filled there is nothing to do. exit
 *          4.1.2/ if order was partially filled place ask to order book. exit
 *      4.2/ if user doesn't have position do short sell
 *          4.2.1/ if there is bid for short_sell, try to fill it. if there are still shares after filling it try again
 *          4.2.2/ if there is no bid for short_sell user has to buy complete set and then sell the outcome he wants,
 * which results in the equal position
 *
 *
 * @param {Number} requestId Value to be passed to callbacks so client can pair callbacks with client call to this
 *     method
 * @param {String} market The market ID on which trading occurs
 * @param {Object} marketOrderBook Bids and asks for market (mixed for all outcomes)
 * @param {Object} userTradeOrder Trade order to execute (usually from UI).
 * @param {Object} userPosition User's position
 * @param {Object} scalarMinMax: {minValue, maxValue} if scalar market; null/undefined otherwise
 * @param {Function} onTradeHash
 * @param {Function} onCommitSent
 * @param {Function} onCommitSuccess
 * @param {Function} onCommitFailed
 * @param {Function} onNextBlock
 * @param {Function} onTradeSent
 * @param {Function} onTradeSuccess
 * @param {Function} onTradeFailed
 * @param {Function} onBuySellSent
 * @param {Function} onBuySellSuccess
 * @param {Function} onBuySellFailed
 * @param {Function} onBuyCompleteSetsSent
 * @param {Function} onBuyCompleteSetsSuccess
 * @param {Function} onBuyCompleteSetsFailed
 */

"use strict";

var BigNumber = require("bignumber.js");
var constants = require("./constants");
var utils = require("./utilities");

BigNumber.config({
    MODULO_MODE: BigNumber.EUCLID,
    ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
});

module.exports = function (
    requestId, market, marketOrderBook,
    userTradeOrder, userPosition, scalarMinMax,
    onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock,
    onTradeSent, onTradeSuccess, onTradeFailed,
    onBuySellSent, onBuySellSuccess, onBuySellFailed,
    onShortSellSent, onShortSellSuccess, onShortSellFailed,
    onBuyCompleteSetsSent, onBuyCompleteSetsSuccess, onBuyCompleteSetsFailed
) {
    var self = this;
    if (requestId.constructor === Object && requestId.requestId) {
        market = requestId.market;
        marketOrderBook = requestId.marketOrderBook;
        userTradeOrder = requestId.userTradeOrder;
        userPosition = requestId.userPosition;
        scalarMinMax = requestId.scalarMinMax;
        onTradeHash = requestId.onTradeHash || utils.noop;
        onCommitSent = requestId.onCommitSent || utils.noop;
        onCommitSuccess = requestId.onCommitSuccess || utils.noop;
        onCommitFailed = requestId.onCommitFailed || utils.noop;
        onNextBlock = requestId.onNextBlock || utils.noop;
        onTradeSent = requestId.onTradeSent || utils.noop;
        onTradeSuccess = requestId.onTradeSuccess || utils.noop;
        onTradeFailed = requestId.onTradeFailed || utils.noop;
        onBuySellSent = requestId.onBuySellSent || utils.noop;
        onBuySellSuccess = requestId.onBuySellSuccess || utils.noop;
        onBuySellFailed = requestId.onBuySellFailed || utils.noop;
        onBuyCompleteSetsSent = requestId.onBuyCompleteSetsSent || utils.noop;
        onBuyCompleteSetsSuccess = requestId.onBuyCompleteSetsSuccess || utils.noop;
        onBuyCompleteSetsFailed = requestId.onBuyCompleteSetsFailed || utils.noop;
        requestId = requestId.requestId;
    }
    var isScalar = scalarMinMax &&
        scalarMinMax.minValue !== undefined &&
        scalarMinMax.maxValue !== undefined;
    var minValue, maxValue;
    if (isScalar) {
        minValue = new BigNumber(scalarMinMax.minValue, 10);
        maxValue = new BigNumber(scalarMinMax.maxValue, 10);
    }
    /**
     * Recursive. Uses either short_sell or buyCompleteSets + sell
     *
     * @param tradeOrderId
     * @param matchingSortedBidIds
     * @param userTradeOrder
     */
    function shortSellUntilZero(tradeOrderId, matchingSortedBidIds, userTradeOrder) {
        var sharesLeft = new BigNumber(userTradeOrder.sharesToSell, 10);
        if (matchingSortedBidIds.length > 0) {
            // 4.2.1/ there is order to fill
            var firstBuyerTradeId = matchingSortedBidIds[0];
            self.short_sell({
                buyer_trade_id: firstBuyerTradeId,
                max_amount: sharesLeft,
                onTradeHash: function (data) {
                    onTradeHash(tradeOrderId, data);
                },
                onCommitSent: function (data) {
                    onCommitSent(tradeOrderId, data);
                },
                onCommitSuccess: function (data) {
                    onCommitSuccess(tradeOrderId, data);
                },
                onCommitFailed: function (data) {
                    onCommitFailed(tradeOrderId, data);
                },
                onNextBlock: function (data) {
                    onNextBlock(tradeOrderId, data);
                },
                onTradeSent: function (data) {
                    onTradeSent(tradeOrderId, data);
                },
                onTradeSuccess: function (data) {
                    onTradeSuccess(tradeOrderId, data);
                    var newSharesLeft = new BigNumber(data.callReturn[1], 10);
                    if (newSharesLeft.gt(constants.ZERO)) {
                        // not all user shares were shorted, recursively short
                        userTradeOrder.sharesToSell = newSharesLeft.toFixed();
                        shortSellUntilZero(tradeOrderId, matchingSortedBidIds.slice(1), userTradeOrder);
                    }
                },
                onTradeFailed: function (data) {
                    onTradeFailed(tradeOrderId, data);
                }
            });
        } else {
            // 4.2.2/ no order to fill
            self.buyCompleteSets({
                market: market,
                amount: userTradeOrder.sharesToSell,
                onSent: function (data) {
                    onBuyCompleteSetsSent(requestId, data);
                },
                onSuccess: function (data) {
                    onBuyCompleteSetsSuccess(requestId, data);
                    self.sell({
                        amount: sharesLeft.toFixed(),
                        price: userTradeOrder.limitPrice,
                        market: market,
                        outcome: userTradeOrder.outcomeID,
                        onSent: function (data) {
                            onBuySellSent(requestId, data);
                        },
                        onSuccess: function (data) {
                            onBuySellSuccess(requestId, data);
                        },
                        onFailed: function (data) {
                            onBuySellFailed(requestId, data);
                        }
                    });
                },
                onFailed: function (data) {
                    onBuyCompleteSetsFailed(requestId, data);
                }
            });
        }
    }

    if (isScalar) {
        userTradeOrder.limitPrice = self.shrinkScalarPrice(minValue, userTradeOrder.limitPrice);
    }
    if (userTradeOrder.type === "buy") {
        // 1.1/ user wants to buy
        var matchingSortedAskIds = Object.keys(marketOrderBook.sell)
            .map(function (askId) {
                return marketOrderBook.sell[askId];
            })
            .filter(function (ask) {
                return ask.outcome === userTradeOrder.outcomeID &&
                    parseFloat(ask.price) <= userTradeOrder.limitPrice;
            }, this)
            .sort(function compareOrdersByPriceAsc(order1, order2) {
                return order1.price < order2.price ? -1 : 0;
            })
            .map(function (ask) {
                return ask.id;
            });

        if (matchingSortedAskIds.length === 0) {
            // 2/ there are no suitable asks on order book
            this.buy({
                amount: userTradeOrder.etherToBuy,
                price: userTradeOrder.limitPrice,
                market: market,
                outcome: userTradeOrder.outcomeID,
                onSent: function onBuySentInner(data) {
                    onBuySellSent(requestId, data);
                },
                onSuccess: function onBuySuccessInner(data) {
                    onBuySellSuccess(requestId, data);
                },
                onFailed: function onBuyFailureInner(data) {
                    onBuySellFailed(requestId, data);
                }
            });
        } else {
            // 3/ there are orders on order book to match
            this.trade({
                max_value: userTradeOrder.etherToBuy,
                max_amount: 0,
                trade_ids: matchingSortedAskIds,
                onTradeHash: function (data) {
                    onTradeHash(requestId, data);
                },
                onCommitSent: function (data) {
                    onCommitSent(requestId, data);
                },
                onCommitSuccess: function (data) {
                    onCommitSuccess(requestId, data);
                },
                onCommitFailed: function (data) {
                    onCommitFailed(requestId, data);
                },
                onNextBlock: function (data) {
                    onNextBlock(requestId, data);
                },
                onTradeSent: function (data) {
                    onTradeSent(requestId, data);
                },
                onTradeSuccess: function localOnTradeSuccess(data) {
                    var etherNotFilled = Number(data.callReturn[1]);
                    if (etherNotFilled > 0) {
                        // 3.1/ order was partially filled so place bid on order book
                        self.buy({
                            amount: etherNotFilled,
                            price: userTradeOrder.limitPrice,
                            market: market,
                            outcome: userTradeOrder.outcomeID,
                            onSent: function localOnBuySent(data) {
                                onBuySellSent(requestId, data);
                            },
                            onSuccess: function localOnBuySuccess(data) {
                                onBuySellSuccess(requestId, data);
                            },
                            onFailed: function localOnBuyFailure(data) {
                                onBuySellFailed(requestId, data);
                            }
                        });
                    }
                    onTradeSuccess(requestId, data);
                },
                onTradeFailed: function (data) {
                    onTradeFailed(requestId, data);
                }
            });
        }
    } else {
        // 1.2/ user wants to sell
        var matchingSortedBidIds = Object.keys(marketOrderBook.buy)
            .map(function (buyId) {
                return marketOrderBook.buy[buyId];
            })
            .filter(function (bid) {
                return bid.outcome === userTradeOrder.outcomeID &&
                    parseFloat(bid.price) >= userTradeOrder.limitPrice;
            })
            .sort(function compareOrdersByPriceDesc(order1, order2) {
                return order1.price < order2.price ? 1 : 0;
            })
            .map(function (bid) {
                return bid.id;
            });

        var hasUserPosition = userPosition && userPosition.qtyShares > 0;
        if (hasUserPosition) {
            if (matchingSortedBidIds.length === 0) {
                // 2/ no bids to match => place ask on order book
                this.sell({
                    amount: userTradeOrder.sharesToSell,
                    price: userTradeOrder.limitPrice,
                    market: market,
                    outcome: userTradeOrder.outcomeID,
                    onSent: function localOnSellSent(data) {
                        onBuySellSent(requestId, data);
                    },
                    onSuccess: function localOnSellSuccess(data) {
                        onBuySellSuccess(requestId, data);
                    },
                    onFailed: function localOnSellFailure(data) {
                        onBuySellFailed(requestId, data);
                    }
                });
            } else {
                // 4.1/ there are bids to match
                this.trade({
                    max_value: 0,
                    max_amount: userTradeOrder.sharesToSell,
                    trade_ids: matchingSortedBidIds,
                    onTradeHash: function (data) {
                        onTradeHash(requestId, data);
                    },
                    onCommitSent: function (data) {
                        onCommitSent(requestId, data);
                    },
                    onCommitSuccess: function (data) {
                        onCommitSuccess(requestId, data);
                    },
                    onCommitFailed: function (data) {
                        onCommitFailed(requestId, data);
                    },
                    onNextBlock: function (data) {
                        onNextBlock(requestId, data);
                    },
                    onTradeSent: function (data) {
                        onTradeSent(requestId, data);
                    },
                    onTradeSuccess: function localOnTradeSuccess(data) {
                        var sharesNotSold = Number(data.callReturn[2]);
                        if (sharesNotSold > 0) {
                            // 4.1.2 order was partially filled
                            self.sell({
                                amount: sharesNotSold,
                                price: userTradeOrder.limitPrice,
                                market: market,
                                outcome: userTradeOrder.outcomeID,
                                onSent: function (data) {
                                    onBuySellSent(requestId, data);
                                },
                                onSuccess: function (data) {
                                    onBuySellSuccess(requestId, data);
                                },
                                onFailed: function (data) {
                                    onBuySellFailed(requestId, data);
                                }
                            });
                        }
                        onTradeSuccess(requestId, data);
                    },
                    onTradeFailed: function (data) {
                        onTradeFailed(requestId, data);
                    }
                });
            }
        } else {
            // 4.2/ no user position
            shortSellUntilZero(requestId, matchingSortedBidIds, userTradeOrder);
        }
    }
};
