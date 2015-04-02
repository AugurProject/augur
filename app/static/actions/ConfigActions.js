var web3 = require('ethereum.js');

var abi = require('../abi');
var constants = require('../constants');

var ConfigActions = {

  checkEthereumClient: function () {
    web3.setProvider(new web3.providers.HttpProvider());

    try {
      web3.eth.accounts;
    } catch(err) {
      console.log('[augur] no ethereum client found');
      this.dispatch(
        constants.config.UPDATE_ETHEREUM_STATUS,
        {ethereumStatus: constants.config.ETHEREUM_STATUS_FAILED});
      return;
    }

    this.dispatch(
      constants.config.UPDATE_ETHEREUM_STATUS,
      {ethereumStatus: constants.config.ETHEREUM_STATUS_CONNECTED});
    this.flux.actions.config.loadContract();
  },

  updateContract: function (evmAddress) {
    var isDemo = this.flux.store('config').getState().isDemo;
    var contract;
    if (isDemo) {

      contract = require('../demo').contract;
      console.log('[augur] running in demo mode');

    } else {

      var Contract = web3.eth.contract(abi);
      contract = new Contract(evmAddress);

      // Attempt a contract call to see if we're good to go.
      if (!contract.call().faucet().toNumber()) {

        this.dispatch(constants.config.UPDATE_CONTRACT_FAILED, {
          evmAddress: evmAddress
        })
        return;
      }

      console.log('[augur] evm contract loaded from ' + evmAddress);
    }

    this.dispatch(constants.config.UPDATE_CONTRACT_SUCCESS, {
      evmAddress: evmAddress,
      contract: contract
    });

    this.flux.actions.network.updateNetwork();
    this.flux.actions.branch.loadBranches();
    this.flux.actions.event.loadEvents();
    this.flux.actions.market.loadMarkets();
  },

  loadContract: function () {
    var evmAddress = this.flux.store('config').getState().evmAddress;
    this.flux.actions.config.updateContract(evmAddress);
  },

  updateIsDemo: function (isDemo) {
    this.dispatch(constants.config.UPDATE_IS_DEMO, {isDemo: isDemo});
    this.flux.actions.config.loadContract();
  }
};

module.exports = ConfigActions;
