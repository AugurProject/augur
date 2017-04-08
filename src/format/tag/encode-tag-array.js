"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var encodeTag = require("./encode-tag");

var encodeTagArray = function (tags) {
  var i, formattedTags = clone(tags);
  if (!formattedTags || formattedTags.constructor !== Array) formattedTags = [];
  if (formattedTags.length) {
    for (i = 0; i < formattedTags.length; ++i) {
      formattedTags[i] = encodeTag(formattedTags[i]);
    }
  }
  while (formattedTags.length < 3) {
    formattedTags.push("0x0");
  }
  return formattedTags;
};

module.exports = encodeTagArray;
