/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var encodeTag = require("../../../../src/format/tag/encode-tag");

describe("format/tag/encode-tag", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(encodeTag(t.tag));
    });
  };
  test({
    tag: undefined,
    assertions: function (tag) {
      assert.deepEqual(tag, "0x0");
    },
  });
  test({
    tag: null,
    assertions: function (tag) {
      assert.deepEqual(tag, "0x0");
    },
  });
  test({
    tag: "",
    assertions: function (tag) {
      assert.deepEqual(tag, "0x0");
    },
  });
  test({
    tag: "Hello World",
    assertions: function (tag) {
      assert.deepEqual(tag, "0x48656c6c6f20576f726c64000000000000000000000000000000000000000000");
    },
  });
});
