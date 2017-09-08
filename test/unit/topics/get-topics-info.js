/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var proxyquire = require("proxyquire").noPreserveCache();

describe("topics/get-topics-info", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getTopicsInfo = proxyquire("../../../src/topics/get-topics-info", {
        "../api": t.mock.api
      });
      getTopicsInfo(t.params, function (topicsInfo) {
        t.assertions(topicsInfo);
        done();
      });
    });
  };
  test({
    description: "three topics",
    params: {
      branch: "0xdad12f",
      offset: 1,
      numTopicsToLoad: 3
    },
    mock: {
      api: function () {
        return {
          Topics: {
            getTopicsInfo: function (p, callback) {
              assert.strictEqual(p.branch, "0xdad12f");
              assert.oneOf(p.offset, [1, 0]);
              assert.oneOf(p.numTopicsToLoad, [3, 0]);
              return callback([
                speedomatic.abiEncodeShortStringAsInt256("Politics"),
                speedomatic.abiEncodeShortStringAsInt256("Sports"),
                speedomatic.abiEncodeShortStringAsInt256("Food")
              ]);
            }
          }
        };
      }
    },
    assertions: function (topicsInfo) {
      assert.deepEqual(topicsInfo, [
        "0x506f6c6974696373000000000000000000000000000000000000000000000000",
        "0x53706f7274730000000000000000000000000000000000000000000000000000",
        "0x466f6f6400000000000000000000000000000000000000000000000000000000"
      ]);
    }
  });
});
