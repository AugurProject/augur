/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var setActiveAccount = require("../../../src/accounts/set-active-account");
var store = require("../../../src/store");

describe("accounts/set-active-account", function () {
  var test = function (t) {
    it(t.description, function () {
      store.reset();
      setActiveAccount(t.account);
      t.assertions(store.getState());
    });
  };
  test({
    description: "Should set the account object to the passed in account",
    account: {
      address: "0x7b2419e0ee0bd034f7bf24874c12512acac6e21c",
      privateKey: Buffer.from("1000000000000000000000000000000000000000000000000000000000000000", "hex"),
      derivedKey: Buffer.from("2000000000000000000000000000000000000000000000000000000000000000", "hex")
    },
    assertions: function (state) {
      assert.deepEqual(state.activeAccount, {
        address: "0x7b2419e0ee0bd034f7bf24874c12512acac6e21c",
        privateKey: Buffer.from("1000000000000000000000000000000000000000000000000000000000000000", "hex"),
        derivedKey: Buffer.from("2000000000000000000000000000000000000000000000000000000000000000", "hex")
      });
    }
  });
  test({
    description: "Should set the account object to the passed in account and handle a privateKey and derivedKey passed as hex strings",
    account: {
      address: "0x7b2419e0ee0bd034f7bf24874c12512acac6e21c",
      keystore: undefined,
      privateKey: "1000000000000000000000000000000000000000000000000000000000000000",
      derivedKey: "2000000000000000000000000000000000000000000000000000000000000000"
    },
    assertions: function (state) {
      assert.deepEqual(state.activeAccount, {
        address: "0x7b2419e0ee0bd034f7bf24874c12512acac6e21c",
        privateKey: Buffer.from("1000000000000000000000000000000000000000000000000000000000000000", "hex"),
        derivedKey: Buffer.from("2000000000000000000000000000000000000000000000000000000000000000", "hex")
      });
    }
  });
});
