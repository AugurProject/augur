"use strict";

var assign = require("lodash").assign;

function defaultOutOfBandErrorHandler(err) {
  if (err) console.error(err);
}

function createEthrpcConfiguration(configuration) {
  return assign({}, configuration, {
    errorHandler: configuration.errorHandler || defaultOutOfBandErrorHandler,
  });
}

module.exports = createEthrpcConfiguration;
