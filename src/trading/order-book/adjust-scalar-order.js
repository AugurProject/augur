"use strict";

var assign = require("lodash.assign");
var expandScalarPrice = require("../expand-scalar-price");

function adjustScalarOrder(order, minValue) {
  return assign({}, order, {
    fullPrecisionPrice: expandScalarPrice(minValue, order.fullPrecisionPrice || order.price),
    price: expandScalarPrice(minValue, order.price)
  });
}

module.exports = adjustScalarOrder;
