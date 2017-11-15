/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var encodeTagArray = require("../../../../src/format/tag/encode-tag-array");

describe("format/tag/encode-tag-array", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(encodeTagArray(t.tags));
    });
  };
  test({
    tags: undefined,
    assertions: function (tags) {
      assert.deepEqual(tags, ["0x0", "0x0", "0x0"]);
    },
  });
  test({
    tags: "",
    assertions: function (tags) {
      assert.deepEqual(tags, ["0x0", "0x0", "0x0"]);
    },
  });
  test({
    tags: ["Hello World"],
    assertions: function (tags) {
      assert.deepEqual(tags, [
        "0x48656c6c6f20576f726c64000000000000000000000000000000000000000000",
        "0x0",
        "0x0",
      ]);
    },
  });
  test({
    tags: ["Hello", "World"],
    assertions: function (tags) {
      assert.deepEqual(tags, [
        "0x48656c6c6f000000000000000000000000000000000000000000000000000000",
        "0x576f726c64000000000000000000000000000000000000000000000000000000",
        "0x0",
      ]);
    },
  });
  test({
    tags: ["Hello", "World", "testing"],
    assertions: function (tags) {
      assert.deepEqual(tags, [
        "0x48656c6c6f000000000000000000000000000000000000000000000000000000",
        "0x576f726c64000000000000000000000000000000000000000000000000000000",
        "0x74657374696e6700000000000000000000000000000000000000000000000000",
      ]);
    },
  });
});
