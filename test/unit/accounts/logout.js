/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var setActiveAccount = require("../../../src/accounts/set-active-account");
var logout = require("../../../src/accounts/logout");
var store = require("../../../src/store");

describe("accounts.logout", function () {
  var test = function (t) {
    it(t.description, function () {
      store.dispatch({type: "RESET_STATE"});
      setActiveAccount({
        address: "7b2419e0ee0bd034f7bf24874c12512acac6e21c",
        privateKey: Buffer.from("1000000000000000000000000000000000000000000000000000000000000000", "hex")
      });
      logout();
      t.assertions(store.getState());
    });
  };
  test({
    description: "Should clear activeAccount state and call ethrpc.clear",
    assertions: function (state) {
      assert.deepEqual(state.activeAccount, {});
    }
  });
});
