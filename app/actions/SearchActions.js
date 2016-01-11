"use strict";

var constants = require("../libs/constants");

module.exports = {
  
  updateKeywords: function (keywords) {
    this.dispatch(constants.search.KEYWORDS_UPDATED, { keywords: keywords });
  }

};
