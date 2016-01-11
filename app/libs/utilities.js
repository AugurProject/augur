"use strict";

var BigNumber = require('bignumber.js');
var abi = require('augur-abi');
var augur = require('augur.js');
var moment = require('moment');
var constants = require('./constants');

module.exports = {

  rotate: function (a) { a.unshift(a.pop()); },

  // calculate date from block number
  blockToDate: function (block, currentBlock) {
    var blockNumber = currentBlock || augur.rpc.blockNumber();
    var seconds = (block - blockNumber) * constants.SECONDS_PER_BLOCK;
    var date = moment().add(seconds, 'seconds');
    return date;
  },

  // assuming date is moment for now
  dateToBlock: function (date, currentBlock) {
    var blockNumber = currentBlock || augur.rpc.blockNumber();
    var now = moment();
    var secondsDelta = date.diff(now, 'seconds');
    var blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK);
    return blockNumber + blockDelta;
  },

  // assumes price is a BigNumber object
  priceToPercent: function (price) {
    var percent = price.times(100).toFixed(2);
    if (price >= 0.999) {
      percent = 100;
    } else if (price <= 0.001) {
      percent = 0;
    } else if (price >= 0.1) {
      percent = price.times(100).toFixed(1);
    }
    return +percent + '%';
  },

  formatEther: function (wei) {
    if (!wei) return { value: '', unit: 'ether', withUnit: '-' };
    var value = abi.bignum(wei).dividedBy(augur.constants.ETHER);
    var unit = 'ether';
    return {
      value: +value.toFixed(2),
      unit: unit,
      withUnit: value.toFixed(2) + ' ' + unit
    };
  },

  // check if account address is correctly formatted
  isValidAccount: function (address) {
    address = address.replace(/^0x/, '');  // strip leading '0x' is it exists
    return address.match(/^[0-9a-fA-F]{40}$/) ? true : false;
  }

};
