"use strict";

var constants = require("../libs/constants");

module.exports = {

  updateKeywords: function (keywords) {
    this.dispatch(constants.search.KEYWORDS_UPDATED, {keywords});
  },

  sortMarkets: function (sortBy, reverse) {
    this.dispatch(constants.search.UPDATE_SORT_BY, {sortBy, reverse});
  }
};
