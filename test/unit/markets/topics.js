"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");

describe("Topics.parseTopicsInfo", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.parseTopicsInfo(t.topicsInfo));
    });
  };
  test({
    description: "parse 1 topic",
    topicsInfo: [
      "0x7265706f7274696e670000000000000000000000000000000000000000000000",
      "0x000000000000000000000000000000000000000000000125d19c239bf9300000",
    ],
    assertions: function (output) {
      assert.deepEqual(output, {reporting: 5420});
    }
  });
  test({
    description: "parse and sort bunch of topics",
    topicsInfo: [
      "0x7265706f7274696e670000000000000000000000000000000000000000000000",
      "0x000000000000000000000000000000000000000000000125d19c239bf9300000",
      "0x656c656374696f6e730000000000000000000000000000000000000000000000",
      "0x000000000000000000000000000000000000000000000012b3d6381c95c40000",
      "0x43616c6578697400000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000093739534d28680000",
      "0x7765617468657200000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000093739534d28680000",
      "0x446f77204a6f6e65730000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000093739534d28680000",
      "0x4175677572000000000000000000000000000000000000000000000000000000",
      "0x00000000000000000000000000000000000000000000001ba5abf9e779380000",
      "0x636f6c6c65676520666f6f7462616c6c00000000000000000000000000000000",
      "0x000000000000000000000000000000000000000000000012b3d6381c95c40000",
      "0x657468657265756d000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000093739534d28680000",
      "0x7370616365000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000093739534d28680000",
      "0x686f7573696e6700000000000000000000000000000000000000000000000000",
      "0x00000000000000000000000000000000000000000000003ee23bde0e7d200000",
      "0x74656d7065726174757265000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000093739534d28680000",
      "0x636c696d617465206368616e6765000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000093739534d28680000",
      "0x636c696d61746500000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000126e72a69a50d00000",
      "0x616e746962696f74696373000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000126e72a69a50d00000",
      "0x6d6f7274616c6974790000000000000000000000000000000000000000000000",
      "0x00000000000000000000000000000000000000000000002f29ace68addd80000",
      "0x676f6c6600000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000a2a15d09519be00000",
      "0x666f6f7462616c6c000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000f3f20b8dfa69d00000",
      "0x6d75736963000000000000000000000000000000000000000000000000000000",
      "0x000000000000000000000000000000000000000000000134ff63f81b0e900000"
    ],
    assertions: function (output) {
      assert.deepEqual(output, {
        music: 5700,
        reporting: 5420,
        football: 4500,
        golf: 3000,
        housing: 1160,
        mortality: 870,
        Augur: 510,
        "college football": 345,
        elections: 345,
        climate: 340,
        antibiotics: 340,
        "climate change": 170,
        "Dow Jones": 170,
        ethereum: 170,
        space: 170,
        Calexit: 170,
        weather: 170,
        temperature: 170,
      });
    }
  });
});

describe("Topics.getTopicsInfoChunked", function () {
  var test = function (t) {
    var getNumTopicsInBranch = augur.getNumTopicsInBranch;
    var getTopicsInfo = augur.getTopicsInfo;
    after(function () {
      augur.getNumTopicsInBranch = getNumTopicsInBranch;
      augur.getTopicsInfo = augur.getTopicsInfo;
    });
    it(t.description, function (done) {
      augur.getNumTopicsInBranch = function (branch, callback) {
        if (!callback) return t.state.numTopicsInBranch;
        callback(t.state.numTopicsInBranch);
      };
      augur.getTopicsInfo = function (params, callback) {
        if (!callback) return t.state.topicsInfo;
        callback(t.state.topicsInfo);
      };
      augur.getTopicsInfoChunked(t.params.branch, t.params.offset, t.params.numTopicsToLoad, t.params.totalTopics, function (topicsInfoChunk) {
        t.assertions(topicsInfoChunk);
      }, done);
    });
  };
  test({
    description: "get all topics",
    params: {
      branch: "0xb1",
      offset: null,
      numTopicsToLoad: null,
      totalTopics: null
    },
    state: {
      numTopicsInBranch: "18",
      topicsInfo: {
        music: 5700,
        reporting: 5420,
        football: 4500,
        golf: 3000,
        housing: 1160,
        mortality: 870,
        Augur: 510,
        "college football": 345,
        elections: 345,
        climate: 340,
        antibiotics: 340,
        "climate change": 170,
        "Dow Jones": 170,
        ethereum: 170,
        space: 170,
        Calexit: 170,
        weather: 170,
        temperature: 170,
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        music: 5700,
        reporting: 5420,
        football: 4500,
        golf: 3000,
        housing: 1160,
        mortality: 870,
        Augur: 510,
        "college football": 345,
        elections: 345,
        climate: 340,
        antibiotics: 340,
        "climate change": 170,
        "Dow Jones": 170,
        ethereum: 170,
        space: 170,
        Calexit: 170,
        weather: 170,
        temperature: 170,
      });
    }
  });
});
