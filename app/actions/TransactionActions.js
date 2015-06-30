var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var TransactionActions = {
	
  addTransaction: function(txHash, type, description, callback) {

    utilities.log(description);

    this.dispatch(constants.transaction.ADD_TRANSACTION, {
      txHash: txHash,
      type: type,
      description: description,
      onComplete: callback
    });
  },

  onPendingTx: function(txHash) {

  	this.flux.actions.transaction.addTransaction(txHash);
  },

  onAugurTx: function(result) {

  	var transactions = this.flux.store('transaction').getState();
  	//console.log(transactions);
  	var txHash = result.transactionHash;
  	//console.log(result);
  	if (transactions[txHash]) {
  		utilities.log('block ' + result.blockNumber +' included ' + txHash);
  		this.dispatch(constants.transaction.UPDATE_TRANSACTIONS, [
  			{txHash: txHash, blockNumber: result.blockNumber}
  		]);
  	}
  }
};

module.exports = TransactionActions;