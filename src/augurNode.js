/**
 * Augur JavaScript API
 * @author Kevin Day (@k_day)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;
var request = (NODE_JS) ? require("request") : require("browser-request");
var noop = function () {};

//for now, cache nodes only have 1 second to respond before we fall back to chain.
request = request.defaults({timeout: 1000});

module.exports  = function () {

  var augur = this;

  return {

    nodes: [],

    //(For now just takes list of nodes as input)
    bootstrap: function (cache_nodes, cb) {
      var self = this;
      cb = cb || noop;
      if (cache_nodes && cache_nodes.constructor === Array) {
        self.nodes = cache_nodes;
      }
      return cb();
    },

    buildRequest: function (endpoint, params) {
      if (this.nodes.length <= 0) return null;

      var url = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      url = url + "/" + endpoint;
      var first = true;
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          if (first) {
            url += "?";
            first = false;
          } else {
            url += "&";
          }
          if (params[key].constructor === Array) {
            url = url + key + "=" + params[key].toString();
          } else {
            url = url + key + "=" + params[key];
          }
        }
      }
      return url;
    },

    fetchHelper: function (url, cb) {
      if (!url) return cb("no nodes to fetch from");
      request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          return cb(null, body);
        } else {
          return cb(url + " " + error);
        }
      });
    },

    getMarketsInfo: function (branch, cb) {
      var url = this.buildRequest("getMarketsInfo", {branch: branch});
      return this.fetchHelper(url, cb);
    },

    getMarketInfo: function (market, cb) {
      var url = this.buildRequest("getMarketInfo", {id: market});
      return this.fetchHelper(url, cb);
    },

    batchGetMarketInfo: function (marketIds, cb) {
      var url = this.buildRequest("batchGetMarketInfo", {ids: marketIds});
      return this.fetchHelper(url, cb);
    },

    getMarketPriceHistory: function (options, cb) {
      var url = this.buildRequest("getMarketPriceHistory", options);
      return this.fetchHelper(url, cb);
    },

    getAccountTrades: function (options, cb) {
      var url = this.buildRequest("getAccountTrades", options);
      return this.fetchHelper(url, cb);
    }
  };
};
