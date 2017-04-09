"use strict";

var unique = function (value, index, self) {
  return self.indexOf(value) === index;
};

module.exports = unique;
