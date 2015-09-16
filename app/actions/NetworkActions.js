var Bignumber = require('bignumber.js');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var NetworkActions = {

  /**
   * Update the UI and stores depending on the state of the network.
   *
   * If the daemon just became reachable (including startup), load the
   * latest data and ensure that we're monitoring new blocks to update our
   * stores. If our Ethereum daemon just became unreachable, dispatch an event so
   * an error dialog can be display.
   */
  checkNetwork: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var networkState = this.flux.store('network').getState();

    var nowUp = augur.rpc.listening();

    var wasUp = (
      networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_CONNECTED
    );
    var wasDown = (
      !networkState.ethereumStatus ||
      networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED
    );

    if (!nowUp) {

      utilities.warn('failed to connect to ethereum');

      // stop monitoring filters
      // augur.filters.ignore(true);

      this.dispatch(constants.network.UPDATE_ETHEREUM_STATUS, {
        ethereumStatus: constants.network.ETHEREUM_STATUS_FAILED
      });

    } else if (wasDown && nowUp) {

      this.dispatch(constants.network.UPDATE_ETHEREUM_STATUS, {
        ethereumStatus: constants.network.ETHEREUM_STATUS_CONNECTED
      });

      this.flux.store('config').setHost();
      this.flux.actions.network.initializeNetwork();
      this.flux.actions.config.initializeData();
    }

    setTimeout(this.flux.actions.network.checkNetwork, 3000);
  },

  initializeNetwork: function () {

    var self = this;

    augur.rpc.version(function (networkId) {
      self.dispatch(constants.network.UPDATE_NETWORK, { networkId: networkId });
    });

    augur.rpc.clientVersion(function (clientVersion) {
      self.dispatch(constants.network.UPDATE_NETWORK, { clientVersion: clientVersion });
    });

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var configState = this.flux.store('config').getState();

    // get account if we're not hosted
    if (!configState.isHosted) {

      ethereumClient.getAccount(function (account) {
        self.dispatch(constants.config.UPDATE_ACCOUNT, {
          currentAccount: account
        });
      }, function () {
        console.log('no unlocked account detected');
        self.dispatch(
          constants.network.UPDATE_ETHEREUM_STATUS,
          {ethereumStatus: constants.network.ETHEREUM_STATUS_NO_ACCOUNT}
        );
      });
    }

    // get all possible accounts from network
    ethereumClient.getAccounts(function (accounts) {
      self.dispatch(constants.network.UPDATE_NETWORK, { accounts: accounts });
    });

    // fetch gasprice once
    augur.rpc.gasPrice(function (gasPrice) {
      if (gasPrice && !gasPrice.error) {
        self.dispatch(constants.network.UPDATE_NETWORK, {
          gasPrice: new Bignumber(gasPrice).toNumber()
        });
      }
    });

    this.flux.actions.network.updateNetwork();
  },

  updateNetwork: function () {
    var self = this;
    var configState = this.flux.store('config').getState();
    var networkState = this.flux.store('network').getState();
    var branchState = this.flux.store('branch').getState();

    // just block age and peer count until we're current
    augur.rpc.blockNumber(function (blockNumber) {

      if (blockNumber && !blockNumber.error) {

        blockNumber = new Bignumber(blockNumber).toNumber();
        var blockMoment = utilities.blockToDate(blockNumber);

        self.dispatch(constants.network.UPDATE_NETWORK, {
          blockNumber: blockNumber,
          blocktime: blockMoment
        });

        augur.rpc.getBlock(blockNumber, true, function (block) {

          if (block && block.constructor === Object && !block.error) {

            var blockTimeStamp = block.timestamp;
            var currentTimeStamp = moment().unix();
            var age = currentTimeStamp - blockTimeStamp;

            self.dispatch(constants.network.UPDATE_BLOCK_CHAIN_AGE, {
              blockChainAge: age
            });
          }
        });
      }
    });

    augur.rpc.peerCount(function (peerCount) {

      if (peerCount && !peerCount.error) {
        self.dispatch(constants.network.UPDATE_NETWORK, {
          peerCount: new Bignumber(peerCount).toFixed()
        });
      }
    });

    if (networkState.blockChainAge &&
        networkState.blockChainAge < constants.MAX_BLOCKCHAIN_AGE)
    {
      augur.rpc.mining(function (mining) {
        self.dispatch(constants.network.UPDATE_NETWORK, { mining: mining });
      });
      augur.rpc.hashrate(function (hashrate) {
        self.dispatch(constants.network.UPDATE_NETWORK, { hashrate: new Bignumber(hashrate).toNumber() });
      });
    }
  }

};

module.exports = NetworkActions;
