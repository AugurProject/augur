"use strict";

var _ = require("lodash");
var abi = require("augur-abi");
var constants = require("../libs/constants");

module.exports = {
  state: {
    keywords: '',
    sortBy: 'startingSortOrder',
    reverseSort: 0,
    cleanKeywords: [],
    markets: {},
    results: []
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

    this.state.results = _.filter(this.state.markets, function(market) {
      return !self.state.cleanKeywords.length || self.state.cleanKeywords.every(function (keyword) {
        return isMarketMatch(market, keyword) || isTagsMatch(market, keyword);
      });
    });

    this.sortMarkets();

    function isMarketMatch(market, keyword) {
      return market.description.toLowerCase().indexOf(keyword) >= 0;
    }

    function isTagsMatch(market, keyword) {
      return (
          market.metadata &&
          market.metadata.tags && market.metadata.tags.length &&
          market.metadata.tags.some(function(tag) {
            return tag.toLowerCase().indexOf(keyword) >= 0;
          })
      );
    }
  },

  handleUpdateSortBy: function (payload) {
    this.state.sortBy = payload.sortBy;
    this.state.reverseSort = payload.reverse;
    this.sortMarkets();
    this.emit(constants.CHANGE_EVENT);
  },
  sortMarkets: function () {
    this.state.results = _.sortBy(this.state.results, this.state.sortBy);
    if (this.state.reverseSort) this.state.results.reverse();
  },
  handleLoadMetadataSuccess: function (payload) {
    if (payload && payload.metadata && payload.metadata.marketId) {
      var marketId = abi.bignum(payload.metadata.marketId);
      if (this.state.markets[marketId]) {
        this.state.markets[marketId].metadata = payload.metadata;
      }
    }
    this.search();
    this.emit(constants.CHANGE_EVENT);
  },
  handlePriceHistoryLoading: function (payload) {
    this.state.markets[payload.marketId].priceHistoryStatus = "loading";
    this.search();
    this.emit(constants.CHANGE_EVENT);
  },
  handleLoadPriceHistorySuccess: function (payload) {
    this.state.markets[payload.market.id].priceHistory = payload.priceHistory;
    this.state.markets[payload.market.id].priceHistoryStatus = "complete";
    this.search();
    this.emit(constants.CHANGE_EVENT);
  }
};
