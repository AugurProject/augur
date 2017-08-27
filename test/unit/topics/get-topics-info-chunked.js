"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("topics/get-topics-info-chunked", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getTopicsInfoChunked = proxyquire("../../../src/topics/get-topics-info-chunked", {
        "../api": function () {
          return {
            Topics: {
              getNumTopicsInBranch: t.mock.getNumTopicsInBranch
            }
          };
        },
        "./get-topics-info": t.mock.getTopicsInfo
      });
      getTopicsInfoChunked(t.params.p, t.assertions, function (topicsInfo) {
        t.params.callback(topicsInfo);
        done();
      });
    });
  };
  test({
    description: "get all topics",
    params: {
      p: {
        branch: "0xb1",
        offset: null,
        numTopicsToLoad: null,
        totalTopics: null
      },
      callback: function (topicsInfo) {}
    },
    mock: {
      getNumTopicsInBranch: function (p, callback) {
        callback("18");
      },
      getTopicsInfo: function (p, callback) {
        callback({
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
  test({
    description: "error with getTopics Info when given TotalTopics",
    params: {
      p: {
        branch: "0xb1",
        offset: null,
        numTopicsToLoad: null,
        totalTopics: "18"
      },
      callback: function (output) {
        assert.deepEqual(output, { error: 999, message: "Uh-Oh!" });
      }
    },
    mock: {
      getNumTopicsInBranch: function (p, callback) {
        callback("18");
      },
      getTopicsInfo: function (p, callback) {
        callback({ error: 999, message: "Uh-Oh!" });
      }
    },
    assertions: function (output) {
      assert.fail();
    }
  });
  test({
    description: "get logs in chunks and recursively call until we load all logs",
    params: {
      p: {
        branch: "0xb1",
        offset: 0,
        numTopicsToLoad: 10,
        totalTopics: 18
      },
      callback: function (topicsInfo) {}
    },
    mock: {
      getNumTopicsInBranch: function (p, callback) {
        callback("18");
      },
      getTopicsInfo: function (p, callback) {
        callback({
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
  test({
    description: "Error getting topics",
    params: {
      p: {
        branch: "0xb1",
        offset: null,
        numTopicsToLoad: null,
        totalTopics: null
      },
      callback: function (topicsInfo) {
        assert.deepEqual(topicsInfo, { error: 999, message: "Uh-Oh!" });
      }
    },
    mock: {
      getNumTopicsInBranch: function (p, callback) {
        callback({ error: 999, message: "Uh-Oh!" });
      },
      getTopicsInfo: function (p, callback) {
        assert.fail();
      }
    },
    assertions: function (output) {
      assert.fail();
    }
  });
});
