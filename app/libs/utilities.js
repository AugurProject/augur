var BigNumber = require('bignumber.js');
var abi = require('augur-abi');
var constants = require('./constants.js')
var moment = window.moment = require('moment');

module.exports = {

  blockToDate: function(block) {

    // calculate date from block number
    var currentBlock = augur.rpc.blockNumber();
    var seconds = (block - currentBlock) * constants.SECONDS_PER_BLOCK;
    var date = moment().add(seconds, 'seconds');

    return date;
  },

  dateToBlock: function(date) {

    // assuming date is moment for now
    var currentBlock = augur.rpc.blockNumber();
    var now = moment();
    var secondsDelta = date.diff(now, 'seconds');
    var blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK);

    return currentBlock + blockDelta;
  },

  bigNumify: function(num) {

    //console.log(typeof(num));
    //console.log(num);
    if (typeof(num) === 'string') {
      return new BigNumber(num);
    } else {
      return num;
    }

  },

  priceToPercent: function(price) {

    // assumes price is a BigNumber object
    var percent = price.times(100).toFixed(2);

    if (price >= .999) {
      percent = 100;
    } else if (price <= .001) {
      percent = 0;
    } else if (price >= 0.1) {
      percent = price.times(100).toFixed(1);
    }

    return +percent + '%'
  },

  formatEther: function (wei) {
    var value, unit;
    if (!wei) return { value: '', unit: 'ether', withUnit: '-' };
    value = abi.bignum(wei);
    if (value.gte(augur.constants.ETHER)) {
      value = value.dividedBy(augur.constants.ETHER);
      unit = 'ether';
    } else {
      unit = 'wei';
    }
    return {
      value: +value.toFixed(4),
      unit: unit,
      withUnit: +value.toFixed(4) + ' ' + unit
    };
  },

  /**
   * Convert a number to a fixed-point BigNumber.
   *
   * Multiplies the value by 2^64, then floors it to get a round BigNumber.
   */
  toFixedPoint: function (value) {
    return constants.ONE_FXP.times(value).floor();
  },

  // check if account address is correctly formatted
  isValidAccount: function(address) {

    address = address.replace(/^0x/, '');  // strip leading '0x' is it exists
    return address.match(/^[0-9a-fA-F]{40}$/) ? true : false;
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
