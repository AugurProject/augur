/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var abiMap = require("../../../../src/contracts").abi;
var parseLogMessage = require("../../../../src/filters/parse-message/parse-log-message");

describe("filters/parse-message/parse-log-message", function () {
  var test = function (t) {
    it(t.contractName + "." + t.eventName + ": " + JSON.stringify(t.msg), function (done) {
      var inputs = abiMap.events[t.eventName].inputs;
      parseLogMessage(t.contractName, t.eventName, t.msg, inputs, function (parsed) {
        for (var i = 0; i < inputs.length; ++i) {
          assert.property(parsed, inputs[i].name);
          assert.isNotNull(parsed[inputs[i].name]);
        }
        done();
      });
    });
  };
  test({
    contractName: "Orders",
    eventName: "MakeOrder",
    msg: [{
      address: "0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3",
      topics: [
        "0x331abc0b32c392f5cdc23a50af9497ab6b82f29ec2274cc33a409e7ab3aedc6c",
        "0xf3efc5085628de2b511a0243bdc9dc7b50ee2440398e626d93280601e3a15634",
        "0x000000000000000000000000d21aa876fe86b0a87f5b6df773d782e1f9bd04df"
      ],
      data: "0000000000000000000000000000000000000000000000000000000000000001",
      blockNumber: "0xc0",
      transactionIndex: "0x0",
      transactionHash: "0x3be9cc70b44bdb25829849f2d2150b5f932b744307ba5b2257e745db6af684de",
      blockHash: "0xf0d3b933c550a39ced64969f856575a3e7876e89288f427d0d876168c9645d3c",
      logIndex: "0x0",
      removed: false
    }]
  });
  test({
    contractName: "Orders",
    eventName: "CancelOrder",
    msg: [{
      address: "0x8d28df956673fa4a8bc30cd0b3cb657445bc820e",
      blockHash: "0x171e8b766a39d5922cdeb45f9f4b3ebfba60d98a4a0b5c1e2dd14fb223fcd595",
      blockNumber: "0x11966f",
      data: "0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c00000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000c84e2b59c1a8cb678624e582d22e3ac0b4bbed6490900065143bf29b0563e1ee00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002",
      logIndex: "0x0",
      topics: [
        "0x9ecf4903f3efaf1549dc51545bd945f94d51923f37ce198a3b838125a2f397d5",
        "0x467982cbbb0fbb3fc4499f4376aa15795f44a999f32369476f355196f52eeb68"
      ],
      transactionHash: "0xf5a45ffe66c9182545dd6c876d2727dded27ea41369ebee7d1b3c7469e70a99c",
      transactionIndex: "0x2"
    }]
  });
  test({
    contractName: "Orders",
    eventName: "TakeOrder",
    msg: [{
      address: "0x13cef2d86d4024f102e480627239359b5cb7bf52",
      blockHash: "0x8171815b23ee1e0cf62e331f283c6d977689a93e3574b2ca35f75c19804914ef",
      blockNumber: "0x11941e",
      data: "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000de0b6b3a7640000640ce61af3b560a54f2f41dcba10ef6337df02e650c30f651789a090b02c312f0000000000000000000000000000000000000000000000000000000000000001",
      logIndex: "0x0",
      topics: [
        "0x715b9a9cb6dfb4fa9cb1ebc2eba40d2a7bd66aa8cef75f87a77d1ff05d29a3b6",
        "0xebb0d4c04bc87d3b401a5baad3b093a5e7cc3f4e996dc53e36db78c8b374cc9a",
        "0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c",
        "0x00000000000000000000000015f6400a88fb320822b689607d425272bea2175f"
      ],
      transactionHash: "0xf9d3dd428f4d27c6ee14c6a08d877f777bc0365d29fad06ddc0f9dce11dbb9ce",
      transactionIndex: "0x0"
    }]
  });
});
