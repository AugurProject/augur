"use strict";

var assert = require("chai").assert;
var compose = require("../../../src/utils/compose");
var isFunction = require("../../../src/utils/is-function");

describe("utils/compose", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var composition = compose(t.prepare, t.callback);
      if (t.expected.type === Function) {
        assert.isTrue(isFunction(composition));
        assert.strictEqual(composition(t.input), t.expected.output);
      } else {
        assert.isNull(composition);
      }
    });
  };
  test({
    prepare: function (x, cb) {
      if (!isFunction(cb)) return 2*x;
      return cb(2*x);
    },
    callback: function (x) { return 3 + x; },
    input: 1,
    expected: {
      type: Function,
      output: 5
    }
  });
  test({
    prepare: function (x, cb) {
      if (!isFunction(cb)) return 2*x;
      return cb(2*x);
    },
    callback: function (x) { return 3 + x; },
    input: 7,
    expected: {
      type: Function,
      output: 17
    }
  });
  test({
    prepare: function (x, cb) {
      if (!isFunction(cb)) return 2*x;
      return cb(2*x);
    },
    callback: null,
    input: 1,
    expected: {type: null}
  });
  test({
    prepare: null,
    callback: null,
    input: 1,
    expected: {type: null}
  });
  test({
    prepare: undefined,
    callback: undefined,
    input: 1,
    expected: {type: null}
  });
  test({
    prepare: null,
    callback: function (x) { return 3 + x; },
    input: 1,
    expected: {
      type: Function,
      output: 4
    }
  });
});
