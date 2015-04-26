var BigNumber = require('bignumber.js');
var web3 = require('web3');
var constants = require('./constants.js')

module.exports = {

  blockToDate: function(block, currentBlock) {

    // calculate date from block number
    var seconds = (block - currentBlock) * constants.SECONDS_PER_BLOCK;
    var date = new Date();
    date.setSeconds(date.getSeconds() + seconds);

    return date;
  },

  dateToBlock: function(date, currentBlock) {

    var now = new Date();
    var secondsDelta = date.valueOf() - now.valueOf();
    var blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK);

    return currentBlock + blockDelta;
  },

  formatDate: function(d) {

    if (!d) return '-';

    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Oct','Sep','Nov','Dec'];

    var hour = d.getHours() > 11  ? d.getHours() - 12 : d.getHours();
    hour = hour === 0 ? 12 : hour;
    var apm = d.getHours() > 10 || d.getHours() == 23 && d.getHours() !== 0 ? 'pm' : 'am';
    var minutes = d.getMinutes() < 10 ? '0'+ d.getMinutes() : d.getMinutes();

    return months[d.getMonth()]+' '+d.getDate()+', '+hour+':'+minutes+' '+apm;
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

    return +value.toFixed(5) + ' ' + unit;
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
  }

};
