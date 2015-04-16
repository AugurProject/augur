var abi = require('../libs/abi');
var constants = require('../libs/constants');

var ConfigActions = {

  updateContract: function (evmAddress) {
    var isDemo = this.flux.store('config').getState().isDemo;
    var contract;
    if (isDemo) {

      contract = require('../libs/demo').contract;
      console.log('[augur] running in demo mode');

    } else if (!evmAddress) {

      console.log('[augur] invalid evm address');
      this.dispatch(constants.config.UPDATE_CONTRACT_FAILED, {
        evmAddress: evmAddress
      });

    } else {

      var Contract = web3.eth.contract(abi);
      contract = new Contract(evmAddress);

      // Attempt a contract call to see if we're good to go.
      if (!contract.call({from: web3.eth.accounts[0]}).faucet().toNumber()) {

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

    // just setting this to 100 for now
    this.dispatch(constants.config.UPDATE_PERCENT_LOADED, {
      percentLoaded: 100
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
