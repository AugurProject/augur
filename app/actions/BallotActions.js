var _ = require('lodash');
var secureRandom = require('secure-random');

var constants = require('../libs/constants');


var byteArrayToNumber = function (bytes) {
  var exponents = _.range(bytes.length).map(i => i * 8);
  var bytesWithExponents = _.zip(bytes, exponents);
  return _.reduce(bytesWithExponents, function (sum, byteAndExponent) {
    var [byte, exponent] = byteAndExponent;
    return byte * Math.pow(2, exponent) + sum;
  });
};

var BallotActions = {

  /**
   * Broadcast the hash of the ballot and store the ballot and salt.
   */
  hashBallot: function (branchId, votePeriod, decisions) {
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var saltBytes = secureRandom(32);
    var saltNumber = byteArrayToNumber(saltBytes);
    ethereumClient.hashReport(decisions, saltNumber);

    // localStorage.write(branchId, votePeriod, decisions, saltNumber)

    // clear pending ballot
  }
};

module.exports = BallotActions;
