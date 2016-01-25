"use strict";

var _ = require("lodash");
var constants = require("../libs/constants");

module.exports = {
  state: {
    keywords: '',
    sortBy: '',
    reverseSort: null,
    cleanKeywords: [],
    markets: {},
    results: {}
  },
  getState: function () {
    return this.state;
  },
  handleMarketsUpdated: function (payload) {
    this.state.markets = payload.markets;
    this.search();
    this.emit(constants.CHANGE_EVENT);
  },
  handleKeywordsUpdated: function (payload) {
    var cleanKeywords = [];
    if (payload.keywords) {
      cleanKeywords = payload.keywords.replace(/\s+/g, ' ');
      cleanKeywords = cleanKeywords.trim().toLocaleLowerCase();
      cleanKeywords = cleanKeywords.split(' ');    
    }
    this.state.keywords = payload.keywords;
    this.state.cleanKeywords = cleanKeywords;
    this.search();
    this.emit(constants.CHANGE_EVENT);
  },
  search: function () {
    var self = this;
    var results = {};
    _.each(this.state.markets, function (market, key) {
      var isMarketMatched = !self.state.cleanKeywords.length || self.state.cleanKeywords.every(function (keyword) {
        return market.description.toLowerCase().indexOf(keyword) >= 0;
      });
      if (isMarketMatched) results[key] = market;
    });
    this.state.results = results;
  },
  handleUpdateSortBy: function (payload) {
    this.state.sortBy = payload.sortBy;
    this.state.reverseSort = payload.reverse;
    this.sortMarkets();
    this.emit(constants.CHANGE_EVENT);
  },
  sortMarkets: function () {
    this.state.results = _.sortBy(this.state.markets, this.state.sortBy);
    if (this.state.reverseSort) this.state.results.reverse();
  }
};
