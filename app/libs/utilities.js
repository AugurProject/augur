var BigNumber = require('bignumber.js');
var web3 = require('web3');
var constants = require('./constants.js')
var moment = window.moment = require('moment');

module.exports = {

  blockToDate: function(block) {

    // calculate date from block number
    var currentBlock = web3.eth.blockNumber;
    var seconds = (block - currentBlock) * constants.SECONDS_PER_BLOCK;
    var date = moment().add(seconds, 'seconds');

    return date;
  },

  dateToBlock: function(date) {

    // assuming date is moment for now
    var currentBlock = web3.eth.blockNumber;
    var now = moment();
    var secondsDelta = date.diff(now, 'seconds');
    var blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK);

    return currentBlock + blockDelta;
  },

  formatEther: function(wei) {

    // detect format and convert
    if (typeof(wei) === 'string' && wei.match(/^0x\w+/)) {
      wei = web3.toWei(wei, 'wei');
    } else if (wei) {
      wei = wei.toNumber();
    } else {
      return '-';
    }

    var value;
    var unit;

    if (wei >= 1000000000000 && wei < 1000000000000000) {
      value = wei / 1000000000000;
      unit = 'szabo';
    } else if (wei >= 1000000000000000 && wei < 1000000000000000000) {
      value = wei / 1000000000000000;
      unit = 'finney';
    } else if (wei >= 1000000000000000000) {
      value = wei / 1000000000000000000;
      unit = 'ether';
    } else {
      value = wei;
      unit = 'wei';
    }

    return {value: +value.toFixed(3), unit: unit};
  },

  /**
   * Convert a number to a fixed-point BigNumber.
   *
   * Multiplies the value by 2^64, then floors it to get a round BigNumber.
   */
  toFixedPoint: function (value) {
    return constants.ONE_FXP.times(value).floor();
  },

  /**
   * Convert a fixed-point BigNumber to an unshifted BigNumber.
   */
  fromFixedPoint: function (value) {
    return value.dividedBy(constants.ONE_FXP);
  },

  consoleStyle: 'background-color: #602A52; color: #fff; padding: 2px 6px;',

  log: function(message) {
    console.log('%caugur', this.consoleStyle, message);
  },

  warn: function(message) {
    console.warn('%caugur', this.consoleStyle, message);
  },

  error: function(message) {
    console.error('%caugur', this.consoleStyle, message);
  },

  debug: function(message) {
    console.log('%caugur', this.consoleStyle, message);
  }

};
