"use strict";

var clone = require("clone");
var encodeTag = require("./encode-tag");

var encodeTagArray = function (tags) {
  var formattedTags = clone(tags);
  if (formattedTags == null || !Array.isArray(formattedTags)) formattedTags = [];
  if (formattedTags.length) {
    for (var i = 0; i < formattedTags.length; ++i) {
      formattedTags[i] = encodeTag(formattedTags[i]);
    }
  }
  while (formattedTags.length < 3) {
    formattedTags.push("0x0");
  }
  return formattedTags;
};

module.exports = encodeTagArray;
