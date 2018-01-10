/* eslint-env mocha */

"use strict";

var expect = require("chai").expect;
var isFunction = require("../../../src/utils/is-function");
var Augur = require("../../../src/");

describe("connections/augur-node", function() {
  it("Has EventEmitter API on its interface", function (done) {
    var augur = new Augur();

    expect(augur.rpc).to.respondTo('on');
    expect(augur.rpc).to.respondTo('off');
    expect(augur.rpc).to.respondTo('emit');
    done();
  });
});
