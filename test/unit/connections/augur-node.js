/* eslint-env mocha */

"use strict";

var expect = require("chai").expect;
var Augur = require("../../../src/");

describe("connections/augur-node", function () {
  it("Has EventEmitter API on its interface", function (done) {
    var augur = new Augur();

    expect(augur.augurNode).to.respondTo("on");
    expect(augur.augurNode).to.respondTo("off");
    expect(augur.augurNode).to.respondTo("emit");
    done();
  });
});
