// setting these to the window object for debugging and console access
window.web3 = require('ethereum.js');
window.BigNumber = require('bignumber.js');
window.$ = require('jquery');
window._ = require('lodash');

window.Identicon = require('./identicon.js');
var Fluxxor = require('fluxxor');
var utilities = require('utilities');


// add jQuery to Browserify's global object so plugins attach correctly.
global.jQuery = $;
require('jquery.cookie');
require('bootstrap');

var AccountActions = require('actions/AccountActions');
var BranchActions = require('actions/BranchActions');
var ConfigActions = require('actions/ConfigActions');
var EventActions = require('actions/EventActions');
var MarketActions = require('actions/MarketActions');
var NetworkActions = require('actions/NetworkActions');

var AccountStore = require('stores/AccountStore');
var BranchStore = require('stores/BranchStore');
var ConfigStore = require('stores/ConfigStore');
var EventStore = require('stores/EventStore');
var MarketStore = require('stores/MarketStore');
var NetworkStore = require('stores/NetworkStore');

var actions = {
  account: AccountActions,
  branch: BranchActions,
  config: ConfigActions,
  event: EventActions,
  market: MarketActions,
  network: NetworkActions
}

var stores = {
  account: AccountStore,
  branch: BranchStore,
  config: ConfigStore,
  event: EventStore,
  market: MarketStore,
  network: NetworkStore
}

var flux = new Fluxxor.Flux(stores, actions);

var augur = {

    evmAddress: 'demo',

    abi: require('./abi.js'),

    data: {
        account: '-',
        balance: '-',
        branches: {},
        markets: {},
        events: {},
        currentBranch: 1010102
    },

    // augur whisper id for market/event comments
    shhId: '0x99cb90f6e0dec117428baedf72d716d0ae677ed69740eb1de5b5a508d0adb7936f2d6590f5a831c369299948a9cf87a68ec2620e7cbba7f57fd91e21087d346f',

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

    /**
     * The callback for the modal to enable demo mode.
     */
    demo: function() {
      $('#no-eth-modal').modal('hide');
      flux.actions.config.updateIsDemo(true);
    },

    /**
     * The entrypoint of the application. Checks for a running Ethereum
     * daemon, and if it doesn't find one, offers to show demo data.
     */
    checkClient: function() {
      flux.actions.config.checkEthereumClient();
    },

    viewBranch: function(id) {
      $('#market, #event').hide();
      flux.actions.branch.updateCurrentBranch(id);
    },

    viewMarket: function(id) {
        var account = flux.stores('account').getState().account;
        var markets = flux.stores('market').getState().markets;
        var market = markets[id];
        var currentPrice = market.priceHistory[market.priceHistory.length-1][1];

        $('#market h3 .text').text(market.text);
        $('#market h3 .current').text(parseInt(currentPrice * 100).toString() + '%');
        $('#market .current-price b').html((currentPrice * 100).toString() + '&cent;');
        $('#market .shares-held b').text(market.sharesHeld[0]);

        // build chart
        var data = google.visualization.arrayToDataTable([['Date', 'Price']].concat(market.priceHistory));
        var options = {
            title: 'Price',
            legend: { position: 'none' },
            backgroundColor: '#f9f6ea',
            chartArea: {top: 10, width: "85%", height: "80%"}
        };
        var chart = new google.visualization.LineChart(document.getElementById('market-chart'));
        $( window ).resize(function() { chart.draw(data, options); });

        var userIdenticon = 'data:image/png;base64,' + new Identicon(account, 50).toString();
        $('.user.avatar').css('background-image', 'url('+userIdenticon+')');

        $('#market .comments').empty();
        $('#market .comment-count').text(market.comments.length.toString());
        var template = _.template($("#comment-template").html());
        _.each(market.comments, function(c) {
            var identicon = 'data:image/png;base64,' + new Identicon(c.author, 50).toString();
            var html = template({author: c.author, avatar: identicon, comment: c.comment, date: utilities.formatDate(c.date)});
            $('#market .comments').append(html);
        });

        $('#market').show();
        $('.markets').hide();
        $('.events').hide();

        chart.draw(data, options);
    },

    // DOM manipulation
    // TODO: Convert to React.
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

        period: function(data) {

            var currentBlock = flux.stores('network').getState().blockNumber;
            // clean up current period
            data.currentPeriod = data.currentPeriod == -1 ? 0 : data.currentPeriod;

            var periodStart = data.periodLength * data.currentPeriod;
            var periodEnd = periodStart + data.periodLength;
            var periodAt = currentBlock - periodStart;
            var periodPercent = (periodAt/ data.periodLength) * 100;
            var periodEndDate = utilities.blockToDate(periodEnd, currentBlock);

            $('.period h3 .branch-name').html(data.name);
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

        branches: function() {
            var account = flux.stores('account').getState().account;
            var contract = flux.stores('config').getState().contract;
            var branchState = flux.stores('branch').getState();
            var branches = branchState.branches;
            var currentBranch = branchState.currentBranch;

            // Update the display for the current branch.
            $('.period .branch-name').attr('data-id', id).text(branches[currentBranch].name);
            $('input.branch-id').val(currentBranch);

            if (_.keys(branches).length) {
                $('.branches').empty();

                // sort on reputation
                //data = data.sort(function(a,b) {return (a.rep > b.rep) ? -1 : ((b.rep > a.rep) ? 1 : 0);} );
                var has_branches = false;
                var has_others = false;

                _.each(branches, function(branch, id) {

                    // update period for current branch
                    if (id == currentBranch) augur.render.period(branch);

                    if (branch.rep) {

                        has_branches = true;
                        var p = $('<p>').html('<span class="pull-left"><b class="branch-name" data-id='+id+'>'+branch.name+'</b><i>'+branch.rep+'</i></span>').addClass('clearfix');
                        var send = $('<a>').attr('href','#').addClass('pull-right').html('<span class="fa fa-share-square-o"></span>').on('click', function() {
                            $('#branch-id').val(id);
                            $('#send-rep-modal .rep-balance').text(branch.rep);
                            $('#send-rep-modal .branch').text(branch.name);
                            $('#send-rep-modal').modal('show');
                        });
                        p.append(send);

                    } else {

                        has_others = true;
                        var p = $('<p class="other">').html('<span>'+branch.name+'</span>');
                    }
                    $('.branches').append(p);
                });

                if (has_others) {
                    var bt = $('<a>').addClass('pull-right branches-toggle').on('click', function(event) {
                        $('.branches').toggleClass('all');
                    });
                    $('.branches').append(bt);
                }

            } else {

                var p = $('<p>').html('<span class="pull-left">There are no branches</span>');
                $('.branches').empty().append(p);
            }

            $('.branch-name').on('click', function(event) {
                var id = $(this).attr('data-id');
                augur.viewBranch(parseInt(id));
            });
        },

        account: function() {
            var accountState = flux.stores('account').getState()

            $('.user.address').html(accountState.account);
            $('.cash-balance').text(accountState.balance);
        },

        network: function() {
            var networkState = flux.stores('network').getState()

            $('.blocks span').text(network.currentBlock);
            $('.blocks').show();

            $('.gas span').text(network.gas);
            $('.gas').show();

            $('.gas-price span').text(network.gasPrice);
            $('.gas-price').show();

            $('.host span').text(network.host);
            $('.host').show();

            $('.peers span').text(network.peerCount);
            $('.peers').show();

            // TODO: Store and display miner status.
            var miner = false;
            $('.miner span').text(false ? 'on' : 'off');
            $('.miner').show();
        },

        markets: function() {

            var branchHasMarkets = false;
            var markets = flux.stores('market').getState().markets;
            var currentBranch = flux.stores('branch').getState().currentBranch;
            $('.markets tbody').empty();

            _.each(markets, function(market, id) {

                if (market.branchId === currentBranch) {
                    branchHasMarkets = true;
                    var row = $('<tr>').html('<td class="text">'+market.text+'</td><td>'+market.volume+'</td><td>'+market.fee+'</td>');

                    if (market.status == 'open') {
                        var trade = $('<td>').text('trading').css('text-align', 'right');
                    } else if (market.status == 'pending') {
                        var trade = $('<td>').text('pending').css('text-align', 'right');
                    } else {
                        var trade = $('<td>').text('closed').css('text-align', 'right');
                    }
                    row.on('click', function() { augur.viewMarket(id) });
                    $(row).append(trade);
                    $('.markets tbody').append(row);
                }
            });

            if (branchHasMarkets) {

                $('.no-markets').hide();
                $('.markets').show();

            } else {

                $('.markets').hide();
            }
        },

        events: function(data) {

            var branchHasEvents = false;
            var events = flux.stores('event').getState().events;
            var currentBranch = flux.stores('branch').getState().currentBranch;
            $('.events tbody').empty();
            $('#market-events').empty();

            _.each(events, function(event, id) {

                if (event.branchId === augur.data.currentBranch) {
                    branchHasEvents = true;
                    var row = $('<tr>').html('<td class="text">'+event.text+'</td><td>'+utilities.formatDate(event.matureDate)+'</td><td>'+event.status+'</td>');
                    $('.events tbody').append(row);
                    // populate add market modal form
                    var option = $('<option>').attr('value', id).text(event.text);
                    $('#market-events').append(option);
                }
            });

            if (branchHasEvents) {

                $('.no-events').hide();
                $('.events').show();
                $('.no-markets').addClass('has-events');

            } else {

                $('.events').hide();
                $('.no-events').show();
                $('.no-markets').removeClass('has-events');
            }
        },

        trade: function(data) {

            data.my_shares = data.my_shares ? data.my_shares : [0,0];
            var states = $('<select>').addClass('states, form-control').attr('name', 'market-state');
            var balances = $('<table>').addClass('table');
            balances.append($('<tr>').html('<th>State</th><th>Owned</th><th>Total</th>'));
            states.append($('<option>').text('Select'));
            _.each(data.states, function(state, i) {
                var s = state == '1' || String(state).toLowerCase() == 'yes' ? 'True' : 'False';
                balances.append($('<tr>').html('<td>'+s+'</td><td>'+data.my_shares[i]+'</td><td>'+data.shares_purchased[i]+'</td>'));
                states.append($('<option>').val(state).text(s));
            });

            // reset trade modal state
            $('#trade-modal input[name=trade-type]').removeAttr('checked');
            $('#trade-modal label.btn').removeClass('active');
            $('#trade-modal button.trade').text('-').attr('disabled', true);

            $('#trade-modal .decision-text').text(m.txt);
            $('#trade-modal .balances').empty().append(balances);
            $('#trade-market').val(data.PM_id);
            $('#trade-modal').modal('show');
            $('#market-state').empty().append(states);
        },

    },

    confirm: function(args) {

        $('#confirm-modal .message').html(args.message);
        if (args.cancelText) $('#confirm-modal button.cancel').text(args.cancelText);
        if (args.confirmText) $('#confirm-modal button.confirm').text(args.confirmText);

        $('#confirm-modal button.confirm').on('click', args.confirmCallback);
        $('#confirm-modal button.cancel').on('click', args.cancelCallback);

        $('#confirm-modal').modal('show');
    }
};

$('#evm-address-form').on('submit', function(event) {
  event.preventDefault();
  var evmAddress = $('#evm-address').val());
  flux.actions.config.updateContract(evmAddress);
  $.cookie('evmAddress', evmAddress);
  //web3.db.set('augur', 'evmAddress', augur.evmAddress);
  $('#evm-address-modal').modal('hide');
});

$('#create-branch-modal form').on('submit', function(event) {

    event.preventDefault();
    // TODO: Replace this with a createBranch action.
    var contract = flux.stores('config').getState().contract;
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
    var account = flux.stores('account').getState().account;
    var contract = flux.stores('config').getState().contract;
    var currentBranch = flux.stores('branch').getState().currentBranch;
    var currentBlock = flux.stores('network').getState().blockNumber;

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
        // FIXME: This won't work, but the createEvent action will handle this properly.
        augur.data.events[id.toNumber()] = newEvent;
        augur.render.events(augur.data.events);
    }

    $('#add-event-modal').modal('hide');
});

$('#add-market-modal form').on('submit', function(event) {

    event.preventDefault();
    // TODO: Replace this with a call to a new createMarket action.
    var account = flux.stores('account').getState().account;
    var contract = flux.stores('config').getState().contract;
    var currentBranch = flux.stores('branch').getState().currentBranch;

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
            messages: ['Oops! Failed to add a new event.']
        };
        augur.render.alert(data);

    } else {
        augur.data.markets[id.toNumber()] = newMarket;
        augur.render.markets(augur.data.markets);
    }

    $('#add-market-modal').modal('hide');
});

$('#send-cash-modal form').on('submit', function(event) {

    event.preventDefault();
    var address = $('#cash-dest-address').val();
    var amount = $('#cash-amount').val();
    nodeMonitor.postMessage({'sendCash': {'address': address, 'amount': amount}});
    $('#send-cash-modal').modal('hide');
});

$('#trade-modal form').on('submit', function(event) {

    event.preventDefault();
    var args = {
        'marketId': $('#trade-market').val(),
        'marketState': $('#market-state select').val(),
        'tradeAmount': $('#trade-amount').val(),
        'tradeType': $('#trade-modal input[name=trade-type]').val()
    };
    //socket.emit('trade', args);
    $('#trade-modal').modal('hide');
});
$('#trade-modal input[name=trade-type]').on('change', function(event) {
   $('#trade-modal button.trade').text($(this).val()).removeAttr('disabled');
});

$('#send-rep-modal form').on('submit', function(event) {

    event.preventDefault();
    // TODO: Replace this with a sendReputation action.
    var contract = flux.stores('config').getState().contract;
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

flux.stores('config').on('change', function () {
  var configState = this.getState();
  if (configState.ethereumStatus === constants.config.ETHEREUM_STATUS_FAILED) {
    // The Ethereum daemon couldn't be reached. Offer to display demo data.
    $('#no-eth-modal').modal('show');
  } else if (!configState.contract) {
    // The Ethereum daemon is available, but we haven't loaded data yet.
    $('#logo .progress-bar').css('width', '50%');
  }

  if (configState.contractFailed) {
    augur.confirm({
      message: '<h4>Augur could not be found.</h4><p>Load a different address?</p>',
      confirmText: 'Yes',
      cancelText: 'No',
      confirmCallback: function() { $('#evm-address-modal').modal('show'); }
    });
  }

  if (configState.contract) {
    $('#logo .progress-bar').css('width', '100%');
    $('body').removeClass('stopped').addClass('running');
  }
});

flux.stores('network').on('change', function () {
  $('.network').show();
});

flux.stores('branch').on('change', function () {
  var currentBranch = this.getState().currentBranch;
  $('.branch-name').removeClass('selected');
  $('.branch-name[data-id='+currentBranch+']').addClass('selected');

  // Since all the data gets loaded at the same time, kick off rerendering
  // the elements when branches are loaded. The React components will
  // render themselves in response to their own data changing.
  augur.render.account();
  augur.render.network();
  augur.render.branches();
  augur.render.markets();
  augur.render.events();
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
