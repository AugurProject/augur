/* eslint-env mocha */

"use strict";

// var assert = require("chai").assert;
// var proxyquire = require("proxyquire").noPreserveCache();

// var mockFillOrderLogs = [{
//   market: "MARKET_ADDRESS",
//   outcome: "OUTCOME_ID",
//   orderType: "buy",
//   orderId: "0x0000000000000000000000000000000000000000000000000000000000000001",
//   price: "1.1",
//   maker: "MAKER_ADDRESS",
//   taker: "TAKER_ADDRESS",
//   makerShares: "0.1",
//   makerTokens: "1.2",
//   takerShares: "2.3",
//   takerTokens: "3.4",
//   tradeGroupId: "0x000000000000000000000000000000000000000000000000000000000000002a",
//   timestamp: 100
// }, {
//   market: "MARKET_ADDRESS",
//   outcome: "OUTCOME_ID",
//   orderType: "buy",
//   orderId: "0x000000000000000000000000000000000000000000000000000000000000000f",
//   price: "2.2",
//   maker: "MAKER_ADDRESS",
//   taker: "TAKER_ADDRESS",
//   makerShares: "4.5",
//   makerTokens: "5.6",
//   takerShares: "6.7",
//   takerTokens: "7.8",
//   tradeGroupId: "0x000000000000000000000000000000000000000000000000000000000000002b",
//   timestamp: 101
// }];

describe("markets/get-market-price-history", function () {
  // var test = function (t) {
  //   it(t.description, function (done) {
  //     var getMarketPriceHistory = proxyquire("../../../src/markets/get-market-price-history", {
  //       "./get-logs-chunked": t.stub.getLogsChunked
  //     });
  //     getMarketPriceHistory(t.params.p, t.params.onChunkReceived, function (err, orderBook) {
  //       t.assertions(err, orderBook);
  //       done();
  //     });
  //   });
  // };
  // test({
  //   description: "price time series from blocks 15 to 20",
  //   params: {
  //     p: {
  //       market: "MARKET_ADDRESS",
  //       outcome: "OUTCOME_ID",
  //       fromBlock: 15,
  //       toBlock: 20
  //     },
  //     onChunkReceived: function (orderBookChunk) {
  //       assert.deepEqual(orderBookChunk, mockFillOrderLogs);
  //     }
  //   },
  //   stub: {
  //     getLogsChunked: function (p, onChunkReceived, onComplete) {
  //       assert.deepEqual(p, {
  //         label: "FillOrder",
  //         filter: {
  //           market: "MARKET_ADDRESS",
  //           outcome: "OUTCOME_ID",
  //           fromBlock: 15,
  //           toBlock: 20
  //         }
  //       });
  //       assert.isFunction(onChunkReceived);
  //       assert.isFunction(onComplete);
  //       onChunkReceived(mockFillOrderLogs);
  //       onComplete(null, mockFillOrderLogs);
  //     }
  //   },
  //   assertions: function (err, marketPriceHistory) {
  //     assert.isNull(err);
  //     assert.deepEqual(marketPriceHistory, {
  //       OUTCOME_ID: [{
  //         price: "1.1",
  //         timestamp: 100
  //       }, {
  //         price: "2.2",
  //         timestamp: 101
  //       }]
  //     });
  //   }
  // });
});
