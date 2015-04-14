// setting these to the window object for debugging and console access
window.BigNumber = require('bignumber.js');
window.$ = require('jquery');
window._ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');

var constants = require('./constants');
var utilities = require('./utilities');

// add jQuery to Browserify's global object so plugins attach correctly.
global.jQuery = $;
require('jquery.cookie');
require('bootstrap');

// flux actions
var AssetActions = require('./actions/AssetActions');
var BranchActions = require('./actions/BranchActions');
var ConfigActions = require('./actions/ConfigActions');
var EventActions = require('./actions/EventActions');
var MarketActions = require('./actions/MarketActions');
var NetworkActions = require('./actions/NetworkActions');
var LogActions = require('./actions/LogActions');

var actions = {
  asset: AssetActions,
  branch: BranchActions,
  config: ConfigActions,
  event: EventActions,
  market: MarketActions,
  network: NetworkActions
}

// flux stores
var AssetStore = require('./stores/AssetStore');
var BranchStore = require('./stores/BranchStore');
var ConfigStore = require('./stores/ConfigStore');
var EventStore = require('./stores/EventStore');
var MarketStore = require('./stores/MarketStore');
var NetworkStore = require('./stores/NetworkStore');
var LogStore = require('./stores/LogStore');

var stores = {
  asset: new AssetStore(),
  branch: new BranchStore(),
  config: new ConfigStore(),
  event: new EventStore(),
  market: new MarketStore(),
  network: new NetworkStore()
}

// base components
var Network = require('./components/Network');
var Period = require('./components/Period');
var Branch = require('./components/Branch');
var Market = require('./components/Market');

// modals
var NoEthereum = require('./components/NoEthereum');
var Alert = require('./components/Alert');
var SendCashNavTrigger = require('./components/SendCash').SendCashNavTrigger;
var AccountDetailsNavTrigger = require('./components/AccountDetails').AccountDetailsNavTrigger;

var flux = new Fluxxor.Flux(stores, actions);

var augur = {

    init: function() {

        // render base react components to document 
        var network = React.createElement(Network, {flux: flux});
        var branch = React.createElement(Branch, {flux: flux});
        var period = React.createElement(Period, {flux: flux});
        var sendCashTrigger = React.createElement(SendCashNavTrigger, {flux: flux});
        var accountDetailsTrigger = React.createElement(AccountDetailsNavTrigger, {flux: flux});

        React.render(network, document.getElementById('network'));
        React.render(branch, document.getElementById('markets'));
        React.render(sendCashTrigger, document.getElementById('send-cash-trigger'));
        React.render(sendCashTrigger, document.getElementById('send-cash-menu-trigger'));
        React.render(accountDetailsTrigger, document.getElementById('account-details-trigger'));
        React.render(accountDetailsTrigger, document.getElementById('account-details-menu-trigger'));

        // get things rolling
        flux.actions.network.checkEthereumClient();

        React.render(period, document.getElementById('period'));
    }
};

flux.store('network').on('change', function () {

  var networkState = this.getState();

  if (networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED) {

    // The Ethereum client couldn't be reached. Offer to display demo data.
    $('#no-eth-modal').modal('show');
  }

});

flux.store('config').on('change', function () {

  var configState = this.getState();

  if (configState.contractFailed) {

    augur.confirm({
      message: '<h4>Augur could not be found.</h4><p>Load a different address?</p>',
      confirmText: 'Yes',
      cancelText: 'No, proceed in demo mode',
      confirmCallback: function() { $('#evm-address-modal').modal('show'); },
      cancelCallback: function() { flux.actions.config.updateIsDemo(true); }
    });
  }

  if (configState.contract) {
    $('#logo .progress-bar').css('width', '100%');
    $('body').removeClass('stopped').addClass('running');
  }
});

flux.on("dispatch", function(type, payload) {
  console.log("Dispatched", type, payload);
});

// TODO: Listen for each new block once we're connected to the Ethereum
// daemon with web3.eth.filter.
// We can always update the network on each block.
// this.flux.actions.network.updateNetwork();
// If we have a contract, we can update the rest of our data.
// this.flux.actions.branch.loadBranches();
// this.flux.actions.event.loadEvents();
// this.flux.actions.market.loadMarkets();

// TODO: Render the period display every time the NetworkStore changes.

module.exports = augur;
