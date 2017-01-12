/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var tools = require("../../tools");

describe("Batch", function () {

  var augur = tools.setup(require("../../../src"), process.argv.slice(2));

  it("batch(Cash.balance, Reporting.getRepBalance)", function (done) {
    this.timeout(tools.TIMEOUT);
    var count = 0;
    var batch = augur.createBatch();
    batch.add("Cash", "balance", [augur.from], function (r) {
      assert.strictEqual(augur.Cash.balance(augur.from), r);
      if ((++count) === 2) done();
    });
    batch.add("Reporting", "getRepBalance", [augur.constants.DEFAULT_BRANCH_ID, augur.from], function (r) {
      assert.strictEqual(augur.getRepBalance(augur.constants.DEFAULT_BRANCH_ID, augur.from), r);
      if ((++count) === 2) done();
    });
    batch.execute();
  });

  it("batch(Faucets.reputationFaucet, Faucets.fundNewAccount)", function (done) {
    this.timeout(tools.TIMEOUT);
    var count = 0;
    var batch = augur.createBatch();
    augur.tx.Faucets.fundNewAccount.send = false;
    augur.tx.Faucets.fundNewAccount.returns = "number";
    augur.tx.Faucets.fundNewAccount.value = 1;
    augur.tx.Faucets.reputationFaucet.send = false;
    augur.tx.Faucets.reputationFaucet.returns = "number";
    batch.add("Faucets", "reputationFaucet", [augur.constants.DEFAULT_BRANCH_ID], function (r) {
      assert.strictEqual(r, "1");
      if ((++count) === 2) done();
    });
    batch.add("Faucets", "fundNewAccount", [augur.constants.DEFAULT_BRANCH_ID], function (r) {
      assert.strictEqual(r, "1");
      if ((++count) === 2) done();
    });
    batch.execute();
  });

});
