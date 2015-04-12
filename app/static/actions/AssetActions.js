var constants = require('../constants');
var utilities = require('../utilities');

var AssetActions = {

  loadAssets: function () {

    var networkStore = this.flux.store('network');
    var contract = this.flux.store('config').getState().contract;
    var web3 = networkStore.getWeb3();
    var account = networkStore.getAccount();

    var balance = contract.call({from: account}).balance(account).dividedBy( new BigNumber(2).toPower(64) );
    var reputation = contract.call({from: account}).getRepBalance('1010101').dividedBy( new BigNumber(2).toPower(64) );
    var gas = utilities.formatGas(web3.eth.getBalance(web3.eth.accounts[0]));
    
    this.dispatch(constants.asset.LOAD_ASSETS_SUCCESS, {
      balance: balance,
      reputation: reputation,
      gas: gas
    });
  }
};

module.exports = AssetActions;
