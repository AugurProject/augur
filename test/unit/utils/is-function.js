/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var isFunction = require("../../../src/utils/is-function");

describe("utils/is-function", function () {
  var test = function (t) {
    it(t.label + " -> " + t.expected, function () {
      assert.strictEqual(isFunction(t.input), t.expected);
    });
  };
  function myFunction() {
    console.log("I'm a function!");
  }
  test({
    label: "declared function",
    input: myFunction,
    expected: true,
  });
  test({
    label: "function literal",
    input: test,
    expected: true,
  });
  test({
    label: "anonymous function",
    input: function () { console.log("hello world!"); },
    expected: true,
  });
  test({
    label: "Function",
    input: Function,
    expected: true,
  });
  test({
    label: "Object",
    input: Object,
    expected: true,
  });
  test({
    label: "5",
    input: 5,
    expected: false,
  });
  test({
    label: "'5'",
    input: "5",
    expected: false,
  });
  test({
    label: "'[object Function]'",
    input: "[object Function]",
    expected: false,
  });
  test({
    label: "{}",
    input: {},
    expected: false,
  });
  test({
    label: "{ hello: 'world' }",
    input: { hello: "world" },
    expected: false,
  });
  test({
    label: "{ f: Function }",
    input: { f: Function },
    expected: false,
  });
  test({
    label: "[]",
    input: [],
    expected: false,
  });
  test({
    label: "[1, 2, 3]",
    input: [1, 2, 3],
    expected: false,
  });
  test({
    label: "[Function]",
    input: [Function],
    expected: false,
  });
});
