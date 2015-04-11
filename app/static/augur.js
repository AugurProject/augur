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

    testClient: function() {

        var testEVM = '0x604380600b600039604e567c010000000000000000000000000000000000000000000000000000000060003504636ffa1caa81141560415760043560405260405160020260605260206060f35b505b6000f3';
        var testABI = [{
            "name": "double(int256)",
            "type": "function",
            "inputs": [{ "name": "x", "type": "int256" }],
            "outputs": [{ "name": "out", "type": "int256" }]
        }];

        var address = web3.eth.sendTransaction({
            data: testEVM,
            from: web3.eth.accounts[0]}
            ), Contract = web3.eth.contract(testABI);

        var testContract = new Contract(address);

        return testContract;
    },

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

        $('#evm-address-form').on('submit', function(event) {
          event.preventDefault();
          var evmAddress = $('#evm-address').val();
          flux.actions.config.updateContract(evmAddress);
          $('#evm-address-modal').modal('hide');
        });

        $('#create-branch-modal form').on('submit', function(event) {

            event.preventDefault();
            // TODO: Replace this with a createBranch action.
            var contract = flux.store('config').getState().contract;
            var parent = parseInt($('#create-branch-modal .branch-parent').val());
            var branchName = $('#create-branch-modal .branch-name').val();

            var newBranch = contract.call().createSubbranch(branchName, 5*60, parent);
            if (newBranch.toNumber()) {
                console.log("[augur] new subbranch " + newBranch.toNumber() + " created");
                $('#create-branch-modal').modal('hide');
            } else {
                augur.render.alert({type: 'danger', messages:['Oops! Failed to create subbranch.']});
                console.log("[augur] failed to create subbranch");
            }
        });

        $('#add-event-modal form').on('submit', function(event) {

            event.preventDefault();
            // TODO: Replace this with a call to a new createEvent action.
            var account = flux.store('network').getAccount();
            var contract = flux.store('config').getState().contract;
            var currentBranch = flux.store('branch').getState().currentBranch;
            var currentBlock = flux.store('network').getState().blockNumber;

            var newEvent = {
                branch: currentBranch,
                text: $('#event-text').val(),
                matureBlock: $('#event-end-block').val(),
                matureDate: utilities.blockToDate($('#event-end-block').val(), currentBlock),
                status: 'pending'
            };

            var id = contract.call().createEvent(newEvent.branch, newEvent.text, newEvent.matureBlock, 0, 1, 2);

            if (id.toNumber() === 0) {
                var data = {
                    type: 'danger',
                    messages: ['Oops! Failed to add a new event.']
                };
                augur.render.alert(data);

            } else {
                // update event store
            }

            $('#add-event-modal').modal('hide');
        });

        $('#add-market-modal form').on('submit', function(event) {

            event.preventDefault();
            // TODO: Replace this with a call to a new createMarket action.
            var account = flux.store('network').getAccount();
            var contract = flux.store('config').getState().contract;
            var currentBranch = flux.store('branch').getState().currentBranch;

            var newMarket = {
                branch: currentBranch,
                text: $('#market-text').val(),
                alpha: $('#market-alpha').val(),
                investment: $('#market-investment').val(),
                creator: account,
                cumulativeScale: null,
                numOutcomes: null,
                tradingPeriod: null,
                fee: 10,
                events: [],
                status: 'pending'
            };

            var id = contract.call().createMarket(newMarket.branch, newMarket.text, newMarket.alpha, newMarket.initial, newMarket.fee, newMarket.events);

            if (id.toNumber() === 0) {
                var data = {
                    type: 'danger',
                    messages: ['Oops! Failed to add a new market.']
                };
                augur.render.alert(data);

            } else {
                // update market store
            }

            $('#add-market-modal').modal('hide');
        });

        $('#send-rep-modal form').on('submit', function(event) {

            event.preventDefault();
            // TODO: Replace this with a sendReputation action.
            var contract = flux.store('config').getState().contract;
            var address = $('#rep-dest-address').val();
            var amount = $('#send-rep-modal .rep-amount').val();
            var branch = $('#send-rep-modal .branch-id').val();

            if (contract.call().sendReputation(branch, address, amount)) {
                $('#send-rep-modal').modal('hide');
            } else {
                console.log('[augur] failed to send reputation');
            }
        });

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

        var network = React.createElement(Network, {flux: flux});
        var branch = React.createElement(Branch, {flux: flux});
        var sendCashTrigger = React.createElement(SendCashNavTrigger, {flux: flux});
        var accountDetailsTrigger = React.createElement(AccountDetailsNavTrigger, {flux: flux});

        React.render(network, document.getElementById('network'));
        React.render(branch, document.getElementById('markets'));
        React.render(sendCashTrigger, document.getElementById('send-cash-trigger'));
        React.render(accountDetailsTrigger, document.getElementById('account-details-trigger'));

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
