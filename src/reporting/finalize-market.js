"use strict";

var api = require("../api");

// { marketID }
function finalizeMarket(p) {
  api().Market.isFinalized({ tx: { to: p.marketID } }, function (isFinalized) {
    if (parseInt(isFinalized, 16) === 1) return p.onSuccess(true);
    api().Market.tryFinalize({ tx: { to: p.marketID, send: false } }, function (readyToFinalize) {
      if (parseInt(readyToFinalize, 16) !== 1) return p.onSuccess(false);
      api().Market.tryFinalize({
        _signer: p._signer,
        tx: { to: p.marketID, send: true },
        onSent: p.onSent,
        onSuccess: p.onSuccess,
        onFailed: p.onFailed
      });
    });
  });
}

module.exports = finalizeMarket;
