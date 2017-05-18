"use strict";

var loadMarketsBatch = require("./load-markets-batch");
var api = require("../api");

// { branchID, chunkSize, isDesc, loadZeroVolumeMarkets }
// load markets in batches
function loadMarkets(p, onChunk) {

  // load the total number of markets
  api().Branches.getNumMarketsBranch({ branch: p.branchID }, function (numMarketsRaw) {
    var numMarkets = parseInt(numMarketsRaw, 10);
    var firstStartIndex = p.isDesc ? Math.max(numMarkets - p.chunkSize + 1, 0) : 0;

    // first pass: only markets with non-zero volume
    loadMarketsBatch({
      branchID: p.branchID,
      startIndex: firstStartIndex,
      chunkSize: p.chunkSize,
      numMarkets: numMarkets,
      isDesc: p.isDesc,
      volumeMin: 0,
      volumeMax: -1
    }, onChunk, function () {

      // second pass: zero-volume markets
      if (p.loadZeroVolumeMarkets) {
        loadMarketsBatch({
          branchID: p.branchID,
          startIndex: firstStartIndex,
          chunkSize: p.chunkSize,
          numMarkets: numMarkets,
          isDesc: p.isDesc,
          volumeMin: -1,
          volumeMax: 0
        }, onChunk);
      }
    });
  });
}

module.exports = loadMarkets;
