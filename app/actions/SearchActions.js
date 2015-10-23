var _ = require('lodash');
var constants = require('../libs/constants');
var utils = require('../libs/utilities');

module.exports = {
  
  updateKeywords: function (keywords) {
		this.dispatch(constants.search.KEYWORDS_UPDATED, { keywords: keywords });
  }
};