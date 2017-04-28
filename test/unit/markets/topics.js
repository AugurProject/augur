"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var isFunction = require("../../../src/utils/is-function");
var encodeTag = require("../../../src/format/tag/encode-tag");
var Augur = require("../../../src");
var augur = new Augur();

describe("Topics.filterByBranchID", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.filterByBranchID(t.params.branchID, t.params.logs));
    });
  };
  test({
    description: "no logs",
    params: {
      branchID: "0xb1",
      logs: []
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "no logs, no branch ID",
    params: {
      branchID: null,
      logs: []
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "1 log, no branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
  test({
    description: "1 log with matching branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
  test({
    description: "1 log with non-matching branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b2",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "2 logs with matching branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }, {
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a2",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1",
        "0x00000000000000000000000000000000000000000000000000000000000000a2"
      ]);
    }
  });
  test({
    description: "1 log with matching branch ID, 1 log with non-matching branchID",
    params: {
      branchID: "0xb1",
      logs: [{
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }, {
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a2",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b2",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
});

describe("Topics.findMarketsWithTopic", function () {
  var getLogs = augur.getLogs;
  var filterByBranchID = augur.filterByBranchID;
  var test = function (t) {
    afterEach(function () {
      augur.getLogs = getLogs;
      augur.filterByBranchID = filterByBranchID;
    });
    describe(t.description, function () {
      it("sync", function () {
        augur.getLogs = t.mocks.getLogs;
        augur.filterByBranchID = t.mocks.filterByBranchID;
        t.assertions(null, augur.findMarketsWithTopic(t.params.topic, t.params.branchID));
      });
      it("async", function (done) {
        augur.getLogs = t.mocks.getLogs;
        augur.filterByBranchID = t.mocks.filterByBranchID
        augur.findMarketsWithTopic(t.params.topic, t.params.branchID, function (err, markets) {
          t.assertions(err, markets);
          done();
        });
      });
    });
  };
  test({
    description: "no logs",
    params: {
      topic: "weather",
      branchID: "0xb1"
    },
    mocks: {
      getLogs: function (label, filterParams, aux, callback) {
        assert.strictEqual(label, "marketCreated");
        assert.strictEqual(filterParams.topic, encodeTag("weather"));
        var logs = [];
        if (!callback) return logs;
        callback(null, logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === abi.format_int256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      assert.isNull(err);
      assert.deepEqual(markets, []);
    }
  });
  test({
    description: "1 log",
    params: {
      topic: "reporting",
      branchID: "0xb1"
    },
    mocks: {
      getLogs: function (label, filterParams, aux, callback) {
        assert.strictEqual(label, "marketCreated");
        assert.strictEqual(filterParams.topic, encodeTag("reporting"));
        var logs = [{
          sender: "0x0000000000000000000000000000000000000b0b",
          marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
          topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
          branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
          marketCreationFee: "0.01",
          eventBond: "4.5",
          timestamp: 1486665600,
          blockNumber: 335,
          transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
          removed: false
        }];
        if (!callback) return logs;
        callback(null, logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === abi.format_int256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      assert.isNull(err);
      assert.deepEqual(markets, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
  test({
    description: "2 logs",
    params: {
      topic: "reporting",
      branchID: "0xb1"
    },
    mocks: {
      getLogs: function (label, filterParams, aux, callback) {
        assert.strictEqual(label, "marketCreated");
        assert.strictEqual(filterParams.topic, encodeTag("reporting"));
        var logs = [{
          sender: "0x0000000000000000000000000000000000000b0b",
          marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
          topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
          branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
          marketCreationFee: "0.01",
          eventBond: "4.5",
          timestamp: 1486665600,
          blockNumber: 335,
          transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
          removed: false
        }, {
          sender: "0x0000000000000000000000000000000000000b0b",
          marketID: "0x00000000000000000000000000000000000000000000000000000000000000a2",
          topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
          branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
          marketCreationFee: "0.01",
          eventBond: "4.5",
          timestamp: 1486665600,
          blockNumber: 335,
          transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
          removed: false
        }];
        if (!callback) return logs;
        callback(null, logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === abi.format_int256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      assert.isNull(err);
      assert.deepEqual(markets, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1",
        "0x00000000000000000000000000000000000000000000000000000000000000a2"
      ]);
    }
  });
  test({
    description: "Error from getLogs",
    params: {
      topic: "reporting",
      branchID: "0xb1"
    },
    mocks: {
      getLogs: function (label, filterParams, aux, callback) {
        assert.strictEqual(label, "marketCreated");
        assert.strictEqual(filterParams.topic, encodeTag("reporting"));
        var logs = { error: 999, message: "Uh-Oh" };
        if (!callback) return logs;
        callback(logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        if (logs && logs.error) return logs;

        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === abi.format_int256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      if (markets) {
        // sync since err is always passed as null
        assert.isNull(err);
        assert.deepEqual(markets, { error: 999, message: "Uh-Oh" });
      } else {
        // async
        assert.deepEqual(err, { error: 999, message: "Uh-Oh" });
        assert.isUndefined(markets);
      }
    }
  });
});

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

describe("Topics.getTopicsInfo", function () {
  // 12 tests total
  var getTopicsInfo = augur.Topics.getTopicsInfo;
  afterEach(function () {
    augur.Topics.getTopicsInfo = getTopicsInfo;
  });
  var test = function (t) {
    it(JSON.stringify(t) + ' sync', function () {
      augur.Topics.getTopicsInfo = t.getTopicsInfo;

      t.assertions(augur.getTopicsInfo(t.branch, t.offset, t.numTopicsToLoad, undefined));
    });
    it(JSON.stringify(t) + ' async', function (done) {
      augur.Topics.getTopicsInfo = t.getTopicsInfo;

      augur.getTopicsInfo(t.branch, t.offset, t.numTopicsToLoad, function (out) {
        t.assertions(out);
        done();
      });
    });
    it(JSON.stringify(t) + ' sync', function () {
      augur.Topics.getTopicsInfo = t.getTopicsInfo;

      t.assertions(augur.getTopicsInfo(t.branch, t.offset, undefined, undefined));
    });
    it(JSON.stringify(t) + ' async', function (done) {
      augur.Topics.getTopicsInfo = t.getTopicsInfo;

      augur.getTopicsInfo(t.branch, t.offset, function (out) {
        t.assertions(out);
        done();
      });
    });
    it(JSON.stringify(t) + ' sync', function () {
      augur.Topics.getTopicsInfo = t.getTopicsInfo;

      t.assertions(augur.getTopicsInfo(t.branch, undefined, undefined, undefined));
    });
    it(JSON.stringify(t) + ' async', function (done) {
      augur.Topics.getTopicsInfo = t.getTopicsInfo;

      augur.getTopicsInfo(t.branch, function (out) {
        t.assertions(out);
        done();
      });
    });
  };
  test({
    branch: '0xdad12f',
    offset: 1,
    numTopicsToLoad: 3,
    getTopicsInfo: function (branch, offset, numTopicsToLoad, callback) {
      assert.deepEqual(branch, '0xdad12f');
      assert.oneOf(offset, [1, 0]);
      assert.oneOf(numTopicsToLoad, [3, 0]);
      if (isFunction(callback)) return callback([
        abi.short_string_to_int256('Politics'), abi.short_string_to_int256('Sports'), abi.short_string_to_int256('Food')
      ]);
      return [
        abi.short_string_to_int256('Politics'), abi.short_string_to_int256('Sports'), abi.short_string_to_int256('Food')
      ];
    },
    assertions: function (out) {
      assert.deepEqual(out, [
        '0x506f6c6974696373000000000000000000000000000000000000000000000000', '0x53706f7274730000000000000000000000000000000000000000000000000000', '0x466f6f6400000000000000000000000000000000000000000000000000000000'
  		]);
    }
  });
  test({
    branch: {
      branch: '0xdad12f',
      offset: 1,
      numTopicsToLoad: 3,
    },
    getTopicsInfo: function (branch, offset, numTopicsToLoad, callback) {
      assert.deepEqual(branch, '0xdad12f');
      assert.oneOf(offset, [1, 0]);
      assert.oneOf(numTopicsToLoad, [3, 0]);
      if (isFunction(callback)) return callback([
        abi.short_string_to_int256('Politics'), abi.short_string_to_int256('Sports'), abi.short_string_to_int256('Food')
      ]);
      return [
        abi.short_string_to_int256('Politics'), abi.short_string_to_int256('Sports'), abi.short_string_to_int256('Food')
      ];
    },
    assertions: function (out) {
      assert.deepEqual(out, [
        '0x506f6c6974696373000000000000000000000000000000000000000000000000', '0x53706f7274730000000000000000000000000000000000000000000000000000', '0x466f6f6400000000000000000000000000000000000000000000000000000000'
  		]);
    }
  });
});

describe("Topics.getTopicsInfoChunked", function () {
  var getNumTopicsInBranch = augur.getNumTopicsInBranch;
  var getTopicsInfo = augur.getTopicsInfo;
  var state;
  var finished;
  var test = function (t) {
    afterEach(function () {
      augur.getNumTopicsInBranch = getNumTopicsInBranch;
      augur.getTopicsInfo = getTopicsInfo;
    });
    it(t.description, function (done) {
      state = t.state;
      finished = done;
      augur.getNumTopicsInBranch = t.mocks.getNumTopicsInBranch;
      augur.getTopicsInfo = t.mocks.getTopicsInfo;
      augur.getTopicsInfoChunked(t.params.branch, t.params.offset, t.params.numTopicsToLoad, t.params.totalTopics, t.assertions, t.params.callback);
    });
  };
  test({
    description: "get all topics",
    params: {
      branch: "0xb1",
      offset: null,
      numTopicsToLoad: null,
      totalTopics: null,
      callback: function (topicsInfo) {
        finished();
      }
    },
    mocks: {
      getNumTopicsInBranch: function (branch, callback) {
        if (!callback) return state.numTopicsInBranch;
        callback(state.numTopicsInBranch);
      },
      getTopicsInfo: function (params, callback) {
        if (!callback) return state.topicsInfo;
        callback(state.topicsInfo);
      }
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
      assert.deepEqual(output, state.topicsInfo);
    }
  });
  test({
    description: "error with getTopics Info when given TotalTopics",
    params: {
      branch: "0xb1",
      offset: null,
      numTopicsToLoad: null,
      totalTopics: '18',
      callback: function (topicsInfo) {
        assert.deepEqual(topicsInfo, { error: 999, message: 'Uh-Oh!' });
        finished();
      }
    },
    mocks: {
      getNumTopicsInBranch: function (branch, callback) {
        if (!callback) return state.numTopicsInBranch;
        callback(state.numTopicsInBranch);
      },
      getTopicsInfo: function (params, callback) {
        if (!callback) return { error: 999, message: 'Uh-Oh!' };
        callback({ error: 999, message: 'Uh-Oh!' });
      }
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
      assert.deepEqual(output, state.topicsInfo);
    }
  });
  test({
    description: "get logs in chunks and recursively call until we load all logs",
    params: {
      branch: "0xb1",
      offset: 0,
      numTopicsToLoad: 10,
      totalTopics: 18,
      callback: function (topicsInfo) {
        finished();
      }
    },
    mocks: {
      getNumTopicsInBranch: function (branch, callback) {
        if (!callback) return state.numTopicsInBranch;
        callback(state.numTopicsInBranch);
      },
      getTopicsInfo: function (params, callback) {
        if (!callback) return state.topicsInfo;
        callback(state.topicsInfo);
      }
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
      assert.deepEqual(output, state.topicsInfo);
    }
  });
  test({
    description: "Error getting Topics",
    params: {
      branch: "0xb1",
      offset: null,
      numTopicsToLoad: null,
      totalTopics: null,
      callback: function (topicsInfo) {
        assert.deepEqual(topicsInfo, { error: 999, message: 'Uh-Oh!' });
        finished();
      }
    },
    mocks: {
      getNumTopicsInBranch: function (branch, callback) {
        // Error for this test!
        if (!callback) return { error: 999, message: 'Uh-Oh!' };
        callback({ error: 999, message: 'Uh-Oh!' });
      },
      getTopicsInfo: function (params, callback) {
        // shouldn't get hit.
        if (!callback) return state.topicsInfo;
        callback(state.topicsInfo);
      }
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
    assertions: undefined
  });
});
