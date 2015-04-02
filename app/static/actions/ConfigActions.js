var abi = require('../abi.js');
var constants = require('../constants');

var ConfigActions = {
  updateContract: function (evmAddress) {
    var isDemo = this.flux.stores('config').getState().isDemo;
    var contract;
    if (isDemo) {
      contract = require('../demo').contract;
    } else {
      var Contract = web3.eth.contract(abi);
      contract = new Contract(augur.evmAddress);
    }

    this.dispatch(constants.config.UPDATE_CONTRACT, {
      evmAddress: evmAddress,
      contract: contract
    });
  },

  updateIsDemo: function (isDemo) {
    this.dispatch(constants.config.UPDATE_IS_DEMO, {isDemo: isDemo});
    var evmAddress = this.flux.stores('config').getState().evmAddress;
    this.flux.actions.config.updateContract(evmAddress);
  }
};

module.exports = ConfigActions;
