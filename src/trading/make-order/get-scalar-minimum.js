"use strict";

function getScalarMinimum(type, minValue) {
  var scalarMinimum = {};
  if (type === "scalar") scalarMinimum.minValue = minValue;
  return scalarMinimum;
}

module.exports = getScalarMinimum;
