"use strict";

module.exports = {
  1: function (order1, order2) {
    return order1.fullPrecisionPrice - order2.fullPrecisionPrice;
  },
  2: function (order1, order2) {
    return order2.fullPrecisionPrice - order1.fullPrecisionPrice;
  }
};
