"use strict";

var loadMarketsBatch = require("./load-markets-batch");
var api = require("../api");

function loadMarkets(branchID, chunkSize, isDesc, loadZeroVolumeMarkets, chunkCB) {
  // load the total number of markets
  api().Branches.getNumMarketsBranch(branchID, function (numMarketsRaw) {
    var numMarkets, firstStartIndex;
    numMarkets = parseInt(numMarketsRaw, 10);
    firstStartIndex = isDesc ? Math.max(numMarkets - chunkSize + 1, 0) : 0;

    // load markets in batches
    // first pass: only markets with nonzero volume
    loadMarketsBatch(branchID, firstStartIndex, chunkSize, numMarkets, isDesc, 0, -1, chunkCB, function () {

      // second pass: zero-volume markets
      if (loadZeroVolumeMarkets) {
        loadMarketsBatch(branchID, firstStartIndex, chunkSize, numMarkets, isDesc, -1, 0, chunkCB);
      }
    });
  });
}

module.exports = loadMarkets;
