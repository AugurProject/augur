// setting these to the window object for debugging and console access
window.BigNumber = require('bignumber.js');
window.$ = require('jquery');
window._ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');

var Identicon = require('./identicon.js');
var constants = require('./constants');
var utilities = require('./utilities');

// add jQuery to Browserify's global object so plugins attach correctly.
global.jQuery = $;
require('jquery.cookie');
require('bootstrap');

var AssetActions = require('./actions/AssetActions');
var BranchActions = require('./actions/BranchActions');
var ConfigActions = require('./actions/ConfigActions');
var EventActions = require('./actions/EventActions');
var MarketActions = require('./actions/MarketActions');
var NetworkActions = require('./actions/NetworkActions');

var AssetStore = require('./stores/AssetStore');
var BranchStore = require('./stores/BranchStore');
var ConfigStore = require('./stores/ConfigStore');
var EventStore = require('./stores/EventStore');
var MarketStore = require('./stores/MarketStore');
var NetworkStore = require('./stores/NetworkStore');

var Network = require('./components/Network');
var Branch = require('./components/Branch');
var Market = require('./components/Market');

var NoEthereum = require('./components/NoEthereum');

var SendCashNavTrigger = require('./components/SendCash').SendCashNavTrigger;
var AccountDetailsNavTrigger = require('./components/AccountDetails').AccountDetailsNavTrigger;

var actions = {
  asset: AssetActions,
  branch: BranchActions,
  config: ConfigActions,
  event: EventActions,
  market: MarketActions,
  network: NetworkActions
}

var stores = {
  asset: new AssetStore(),
  branch: new BranchStore(),
  config: new ConfigStore(),
  event: new EventStore(),
  market: new MarketStore(),
  network: new NetworkStore()
}

var flux = new Fluxxor.Flux(stores, actions);

var augur = {

    render: {

        alert: function(data) {

            $('#alert').show();

            $('#alert').removeClass('alert-info').removeClass('alert-success').removeClass('alert-warning').removeClass('alert-danger');
            $('#alert').addClass('alert-'+data.type);

            items = [];
            _.each(data.messages, function(message) {
                items.push($('<p>').html(message));
            });
            $('#alert div').append(items);
            $('#alert').show();
            $('#alert div').scrollTop($('#alert div')[0].scrollHeight);
        },

        period: function() {

            var branchState = flux.store('branch').getState();
            var currentBranchData = branchState.branches[branchState.currentBranch];
            var currentBlock = flux.store('network').getState().blockNumber;

            // clean up current period
            var currentPeriod;
            if (currentBranchData.currentPeriod == -1) {
              currentPeriod = 0;
            } else {
              currentPeriod = currentBranchData.currentPeriod;
            }

            var periodStart = currentBranchData.periodLength * currentPeriod;
            var periodEnd = periodStart + currentBranchData.periodLength;
            var periodAt = currentBlock - periodStart;
            var periodPercent = (periodAt/ currentBranchData.periodLength) * 100;
            var periodEndDate = utilities.blockToDate(periodEnd, currentBlock);

            $('.period h3 .branch-name').html(currentBranchData.name);
            $('.period h3 .period-ending').html('Period ending ' + utilities.formatDate(periodEndDate));
            $('.period-end-block').text(periodEnd);

            var phases = [{name: 'reporting', percent: periodPercent}];

            var template = _.template($("#progress-template").html());
            $('.period .progress').empty();
            _.each(phases, function(p) {
                $('.period .progress').append(template({'type': p.name, 'percent': p.percent}));
            });

            $('.period').show();
        },

        account: function() {
            var balance = flux.store('asset').getState().balance;
            var account = flux.store('network').getAccount();

            $('.user.address').html(account);
            $('.cash-balance').text(balance);
        }
    },

    confirm: function(args) {

        $('#confirm-modal .message').html(args.message);
        if (args.cancelText) $('#confirm-modal button.cancel').text(args.cancelText);
        if (args.confirmText) $('#confirm-modal button.confirm').text(args.confirmText);

        $('#confirm-modal button.confirm').on('click', args.confirmCallback);
        $('#confirm-modal button.cancel').on('click', args.cancelCallback);

        $('#confirm-modal').modal('show');
    },

    init: function() {

        $('#market .buy input').on('focus', function(event) {

            $('#market .chart').hide();
            $('#market .details').show();
        });
        $('#market .buy input').on('blur', function(event) {

            $('#market .details').hide();
            $('#market .chart').show();
        });

        $('#alert').on('closed.bs.alert', function() {
            $('#alert div').empty();
        });

        $('.start-demo-mode').on('click', function(event) {
            event.preventDefault();
            flux.actions.config.updateIsDemo(true);
        });

        // render base react components to document 
        var network = React.createElement(Network, {flux: flux});
        var branch = React.createElement(Branch, {flux: flux});
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
    }
};


function renderAll() {
  augur.render.account();
  augur.render.period();
}

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

flux.store('branch').on('change', function () {
  var currentBranch = this.getState().currentBranch;
  $('.branch-name').removeClass('selected');
  $('.branch-name[data-id='+currentBranch+']').addClass('selected');

  renderAll();
});

flux.store('market').on('change', function () {
  renderAll();
});

flux.store('event').on('change', function () {
  renderAll();
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
