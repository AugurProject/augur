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

    console.log(tx.description + ' ('+tx.hash+')');
    this.dispatch(constants.transaction.ADD_TRANSACTION, tx);
  },

  onPendingTx: function(txHash) {

  	this.flux.actions.transaction.addTransaction(txHash);
  }
};

module.exports = TransactionActions;