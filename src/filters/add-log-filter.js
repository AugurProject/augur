"use strict";

var addLogFilter = function (blockStream, label, contractAddress, signature) {
  blockStream.addLogFilter({address: contractAddress, topics: [signature]});
};

module.exports = addLogFilter;
