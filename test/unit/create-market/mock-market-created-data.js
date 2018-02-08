"use strict";

var abi = require("augur-core").abi;
var speedomatic = require("speedomatic");
var encodeTransactionInputs = require("../../../src/api/encode-transaction-inputs");
var hashEventAbi = require("../../../src/events/hash-event-abi");

var marketCreatedEventAbi = abi.Augur.find(function (abi) {
  return abi.type === "event" && abi.name === "MarketCreated";
});
var marketCreatedEventNonIndexedInputs = marketCreatedEventAbi.inputs.filter(function (abi) { return !abi.indexed; });
var marketCreatedParamTypes = marketCreatedEventNonIndexedInputs.map(function (abi) { return abi.type; });
var marketCreatedParamObject = {
  market: "0xbb785f16f6aab68007e897ac3560378d8d6ffd16",
  marketCreationFee: speedomatic.fix("0.010000000006", "hex"),
  minPrice: "0x0",
  maxPrice: speedomatic.fix("10000", "hex"),
  marketType: "0x0",
  description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
  outcomes: [0, 0],
  extraInfo: JSON.stringify({
    resolutionSource: "http://www.spacex.com",
    tags: ["SpaceX", "spaceflight"],
    longDescription: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
  }),
};

module.exports = {
  abi: marketCreatedEventAbi,
  eventSignature: hashEventAbi(marketCreatedEventAbi),
  params: marketCreatedParamObject,
  abiEncodedData: speedomatic.abiEncodeData({
    signature: marketCreatedParamTypes,
    params: encodeTransactionInputs(marketCreatedParamObject, marketCreatedEventNonIndexedInputs.map(function (abi) {
      return abi.name;
    }), marketCreatedParamTypes),
  }, "hex"),
};
