"use strict";

var assign = require("lodash.assign");
var eventsAPI = require("augur-contracts").api.events;
var rpcInterface = require("../../rpc-interface");
var api = require("../../api");
var parseLogMessage = require("../../filters/parse-message/parse-log-message");

// { branch, market, onSent, onSuccess, onFailed }
function claimProceeds(p) {
  api().CloseMarket.claimProceeds(assign({}, p, {
    onSuccess: function (res) {
      if (res.callReturn !== "1") return p.onFailed(res.callReturn);
      rpcInterface.getTransactionReceipt(res.hash, function (receipt) {
        var logs, sig, i, numLogs, inputs;
        if (receipt && Array.isArray(receipt.logs) && receipt.logs.length) {
          logs = receipt.logs;
          sig = eventsAPI.payout.signature;
          inputs = eventsAPI.payout.inputs;
          for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
            if (logs[i].topics[0] === sig) {
              res.callReturn = parseLogMessage("payout", logs[i], inputs);
              break;
            }
          }
        }
        p.onSuccess(res);
      });
    }
  }));
}

module.exports = claimProceeds;
