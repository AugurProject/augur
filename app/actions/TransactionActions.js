var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var TransactionActions = {
	
  addTransaction: function(tx) {

    /*
    *  tx is an object describing a transaction
    *  tx is passed to the store here and used in the constructor of an augur transaction object
    *  {
    *    hash: '0xaf653...',
    *    type: constants.transaction.SEND_REP_TYPE, 
    *    description: 'send reputation to ...', 
    *    onMined: function(result) { .... }
    *  }
    */

    utilities.log(params.description + ' ('+params.hash+')');
    this.dispatch(constants.transaction.ADD_TRANSACTION, params);
  },

  onPendingTx: function(txHash) {

  	this.flux.actions.transaction.addTransaction(txHash);
  },

  onAugurTx: function(result) {

  	var transactions = this.flux.store('transaction').getState();
    var hash = result.transactionHash;

  	//console.log('transactions', transactions);
    //console.log('augurTx', result);

  	if (transactions[hash]) {

  		utilities.log('block ' + result.blockNumber +' included ' + hash);

      // fire onMined if exists
      if (transactions[hash].onMined) transactions[hash].onMined(result);

  		this.dispatch(constants.transaction.UPDATE_TRANSACTIONS, [
  			{hash: hash, blockNumber: result.blockNumber}
  		]);
  	}
  }
};

module.exports = TransactionActions;