/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var rpc = require("ethrpc");
var contracts = require("augur-contracts");
var tools = require("../../tools");

require("it-each")({testPerIteration: true});

describe("Read contracts", function () {

  var test = function (c, network) {
    var res = rpc.read(contracts[network][c]);
    assert.notProperty(res, "error");
    assert.notStrictEqual(res, "0x");
  };

  var contract_list = [];
  for (var c in contracts["2"]) {
    if (!contracts["2"].hasOwnProperty(c)) continue;
    contract_list.push(c);
  }

  it.each(contract_list, "read %s", ['element'], function (element, next) {
    this.timeout(tools.TIMEOUT);
    rpc.reset();
    rpc.version(function (network) {
      test(element, network);
      next();
    });
  });

});
