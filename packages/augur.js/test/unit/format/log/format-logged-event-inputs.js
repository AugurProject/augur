/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var hashEventSignature = require("../../../../src/events/hash-event-signature");
var formatLoggedEventInputs = require("../../../../src/format/log/format-logged-event-inputs");

describe("format/log/format-logged-event-inputs", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(formatLoggedEventInputs(t.params.loggedTopics, t.params.loggedData, t.params.abiEventInputs));
    });
  };
  test({
    description: "Approval(address,address,uint256)",
    params: {
      loggedTopics: [
        hashEventSignature("Approval(address,address,uint256)"),
        "0x0000000000000000000000000000000000000000000000000000000000000001", // owner
        "0x0000000000000000000000000000000000000000000000000000000000000002",  // spender
      ],
      loggedData: "0x000000000000000000000000000000000000000000000000000000000000000a", // attotokens
      abiEventInputs: [{
        indexed: true,
        type: "address",
        name: "owner",
      }, {
        indexed: true,
        type: "address",
        name: "spender",
      }, {
        indexed: false,
        type: "uint256",
        name: "attotokens",
      }],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        owner: "0x0000000000000000000000000000000000000001",
        spender: "0x0000000000000000000000000000000000000002",
        attotokens: "10",
      });
    },
  });
  test({
    description: "MarketCreated(address,address,address,uint256,string)",
    params: {
      loggedTopics: [
        hashEventSignature("MarketCreated(address,address,address,uint256,string)"),
        "0x000000000000000000000000000000000000000000000000000000000000000b", // universe
        "0x000000000000000000000000000000000000000000000000000000000000000a", // market
        "0x0000000000000000000000000000000000000000000000000000000000000b0b",  // marketCreator
      ],
      loggedData: "0x00000000000000000000000000000000000000000000005150ae84a8cdf00000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001137b226d61726b657454797065223a2263617465676f726963616c222c2273686f72744465736372697074696f6e223a2257696c6c2074686973206d61726b65742062652074686520e29883204d61726b65743f222c226c6f6e674465736372697074696f6e223a22e29883204d61726b657420746f2072756c65207468656d20616c6c2e2020e381aae3819ce3819de38293e381aae381abe79c9fe589a3e381aae38293e381a0efbc9f222c226f7574636f6d654e616d6573223a5b22596573222c224e6f222c22436f6e73756c7420e29883225d2c2274616773223a5b22e29883222c22466c616d696e672065796573225d2c226372656174696f6e54696d657374616d70223a313233343536373839307d00000000000000000000000000",
      abiEventInputs: [{
        name: "universe",
        type: "address",
        indexed: true,
      }, {
        name: "market",
        type: "address",
        indexed: true,
      }, {
        name: "marketCreator",
        type: "address",
        indexed: true,
      }, {
        name: "marketCreationFee",
        type: "uint256",
        indexed: false,
      }, {
        name: "extraInfo",
        type: "string",
        indexed: false,
      }],
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x000000000000000000000000000000000000000a",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "1500000000000000000000",
        extraInfo: JSON.stringify({
          marketType: "categorical",
          shortDescription: "Will this market be the \u2603 Market?",
          longDescription: "\u2603 Market to rule them all.  \u306a\u305c\u305d\u3093\u306a\u306b\u771f\u5263\u306a\u3093\u3060\uff1f",
          outcomeNames: ["Yes", "No", "Consult \u2603"],
          tags: ["\u2603", "Flaming eyes"],
          creationTimestamp: 1234567890,
        }),
      });
    },
  });
});
