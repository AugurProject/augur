"use strict";

var _ = require("lodash");
var Fluxxor = require("fluxxor");
var constants = require("../libs/constants");

var state = {
  keywords: '',
  cleanKeywords: [],
  markets: {},
  results: {}
};

module.exports = Fluxxor.createStore({

  initialize: function () {
    this.bindActions(
      constants.market.LOAD_MARKETS_SUCCESS, this.handleMarketsUpdated,
      constants.market.UPDATE_MARKETS_SUCCESS, this.handleMarketsUpdated,
      constants.search.KEYWORDS_UPDATED, this.handleKeywordsUpdated
    );
  },

  getState: function () {
    return state;
  },
  
  handleMarketsUpdated: function (payload) {
    state.markets = payload.markets;
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

    state.keywords = payload.keywords;
    state.cleanKeywords = cleanKeywords;
    
    this.search();
    this.emit(constants.CHANGE_EVENT);
  },

  search: function () {
    var results = {};
    		
    _.each(state.markets, function (market, key) {  
      var isMarketMatched = !state.cleanKeywords.length || state.cleanKeywords.every(function (keyword) {
        return market.description.toLowerCase().indexOf(keyword) >= 0;
      });
      
      if (isMarketMatched) {
        results[key] = market;
      }
    });		

    state.results = results;
  }  
});