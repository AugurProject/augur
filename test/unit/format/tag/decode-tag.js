/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var decodeTag = require("../../../../src/format/tag/decode-tag");

describe("format/tag/decode-tag", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(decodeTag(t.tag));
    });
  };
  test({
    tag: undefined,
    assertions: function (tag) {
      assert.isNull(tag);
    },
  });
  test({
    tag: null,
    assertions: function (tag) {
      assert.isNull(tag);
    },
  });
  test({
    tag: "",
    assertions: function (tag) {
      assert.isNull(tag);
    },
  });
  test({
    tag: "0x",
    assertions: function (tag) {
      assert.isNull(tag);
    },
  });
  test({
    tag: "0x0",
    assertions: function (tag) {
      assert.isNull(tag);
    },
  });
  test({
    tag: "0x48656c6c6f20576f726c64000000000000000000000000000000000000000000",
    assertions: function (tag) {
      assert.strictEqual(tag, "Hello World");
    },
  });
  test({
    tag: speedomatic.abiEncodeShortStringAsInt256("This is my tag!"),
    assertions: function (tag) {
      assert.deepEqual(tag, "This is my tag!");
    },
  });
});
