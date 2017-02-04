"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");

describe("Tags.parseTagsInfo", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.parseTagsInfo(t.tagsInfo));
    });
  };
  test({
    description: "parse 1 tag",
    tagsInfo: [
      "0x7265706f7274696e670000000000000000000000000000000000000000000000",
      "0x000000000000000000000000000000000000000000000125d19c239bf9300000",
    ],
    assertions: function (output) {
      assert.deepEqual(output, [{tag: "reporting", popularity: 5420}]);
    }
  });
  test({
    description: "parse and sort bunch of tags",
    tagsInfo: [
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
      assert.deepEqual(output, [
        {tag: "music", popularity: 5700},
        {tag: "reporting", popularity: 5420},
        {tag: "football", popularity: 4500},
        {tag: "golf", popularity: 3000},
        {tag: "housing", popularity: 1160},
        {tag: "mortality", popularity: 870},
        {tag: "Augur", popularity: 510},
        {tag: "college football", popularity: 345},
        {tag: "elections", popularity: 345},
        {tag: "climate", popularity: 340},
        {tag: "antibiotics", popularity: 340},
        {tag: "climate change", popularity: 170},
        {tag: "Dow Jones", popularity: 170},
        {tag: "ethereum", popularity: 170},
        {tag: "space", popularity: 170},
        {tag: "Calexit", popularity: 170},
        {tag: "weather", popularity: 170},
        {tag: "temperature", popularity: 170}
      ]);
    }
  });
});

describe("Tags.getTagsInfoChunked", function () {
  var test = function (t) {
    var getNumTagsInBranch = augur.getNumTagsInBranch;
    var getTagsInfo = augur.getTagsInfo;
    after(function () {
      augur.getNumTagsInBranch = getNumTagsInBranch;
      augur.getTagsInfo = augur.getTagsInfo;
    });
    it(t.description, function (done) {
      augur.getNumTagsInBranch = function (branch, callback) {
        if (!callback) return t.state.numTagsInBranch;
        callback(t.state.numTagsInBranch);
      };
      augur.getTagsInfo = function (params, callback) {
        if (!callback) return t.state.tagsInfo;
        callback(t.state.tagsInfo);
      };
      augur.getTagsInfoChunked(t.params.branch, t.params.offset, t.params.numTagsToLoad, t.params.totalTags, function (tagsInfoChunk) {
        t.assertions(tagsInfoChunk);
      }, done);
    });
  };
  test({
    description: "get all tags",
    params: {
      branch: "0xb1",
      offset: null,
      numTagsToLoad: null,
      totalTags: null
    },
    state: {
      numTagsInBranch: "18",
      tagsInfo: [
        {tag: "music", popularity: 5700},
        {tag: "reporting", popularity: 5420},
        {tag: "football", popularity: 4500},
        {tag: "golf", popularity: 3000},
        {tag: "housing", popularity: 1160},
        {tag: "mortality", popularity: 870},
        {tag: "Augur", popularity: 510},
        {tag: "college football", popularity: 345},
        {tag: "elections", popularity: 345},
        {tag: "climate", popularity: 340},
        {tag: "antibiotics", popularity: 340},
        {tag: "climate change", popularity: 170},
        {tag: "Dow Jones", popularity: 170},
        {tag: "ethereum", popularity: 170},
        {tag: "space", popularity: 170},
        {tag: "Calexit", popularity: 170},
        {tag: "weather", popularity: 170},
        {tag: "temperature", popularity: 170}
      ]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {tag: "music", popularity: 5700},
        {tag: "reporting", popularity: 5420},
        {tag: "football", popularity: 4500},
        {tag: "golf", popularity: 3000},
        {tag: "housing", popularity: 1160},
        {tag: "mortality", popularity: 870},
        {tag: "Augur", popularity: 510},
        {tag: "college football", popularity: 345},
        {tag: "elections", popularity: 345},
        {tag: "climate", popularity: 340},
        {tag: "antibiotics", popularity: 340},
        {tag: "climate change", popularity: 170},
        {tag: "Dow Jones", popularity: 170},
        {tag: "ethereum", popularity: 170},
        {tag: "space", popularity: 170},
        {tag: "Calexit", popularity: 170},
        {tag: "weather", popularity: 170},
        {tag: "temperature", popularity: 170}
      ]);
    }
  });
});
