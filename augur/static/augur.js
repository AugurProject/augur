var web3 = require('ethereum.js');
var BigNumber = require('bignumber.js');
var $ = require('jquery');
var _ = require('lodash');

// Add jQuery to Browserify's global object so plugins attach correctly.
global.jQuery = $;
require('jquery.cookie');
require('bootstrap');

var augur = {

    evmAddress: 'demo',

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

    demo: function() {

        $('#no-eth-modal').modal('hide');
        augur.demoMode = true;
        var demo = require('./demo.js');
        web3 = demo.web3;

        augur.checkClient();
    },

    checkClient: function() {

        web3.setProvider(new web3.providers.HttpProvider());

        var client = true;

        try {
            web3.eth.accounts;
        } catch(err) {
            console.log('[augur] no ethereum client found');
            $('#no-eth-modal').modal('show');
            client = false;
        }

        $('#logo .progress-bar').css('width', '25%');

        augur.network = {
            host: 'localhost:8080',
            peerCount: '-',
            blockNumber: '-',
            miner: web3.eth.mining,
            gas: '-',
            gasPrice: '-'
        };

        augur.data.account = web3.eth.accounts[0];
        augur.syncNetwork();

        // watch ethereum for changes and update network data
        web3.eth.filter('latest').watch(function(log) {
            console.log('[augur] network changed');
            augur.syncNetwork();
        });

        $('#logo .progress-bar').css('width', '50%');
        $('.network').show();

        if (client) augur.load();
    },

    load: function() {

        $('#evm-address-form').on('submit', function(event) {
            event.preventDefault();
            augur.evmAddress = $('#evm-address').val();
            $.cookie('evmAddress', augur.evmAddress);
            //web3.db.set('augur', 'evmAddress', augur.evmAddress);
            $('#evm-address-modal').modal('hide');
            augur.load();
        });

        // get EVM address
        if (!augur.evmAddress) {
            if ($.cookie('evmAddress')) {
                augur.evmAddress = $.cookie('evmAddress');
            } else if (web3.db.get('augur', 'evmAddress')) {
                augur.evmAddress = web3.db.get('augur', 'evmAddress');
            } else {
                $('#evm-address-modal').modal('show');
                return;
            }
        }

        $('#logo .progress-bar').css('width', '75%');

        if (augur.evmAddress == 'demo') {
            var demo = require('./demo.js');
            augur.contract = demo.contract;
        } else {
            var Contract = web3.eth.contract(augur.abi);
            augur.contract = new Contract(augur.evmAddress);
        }

        // check to see if contract was successfully loaded
        if (augur.contract.call().faucet().toNumber()) {

            console.log('[augur] evm contract loaded from ' + augur.evmAddress);
            $('#logo .progress-bar').css('width', '100%');
            augur.init();

        } else {

            augur.confirm({
                message: '<h4>Augur could not be found.</h4><p>Load a different address?</p>',
                confirmText: 'Yes',
                cancelText: 'No',
                confirmCallback: function() { $('#evm-address-modal').modal('show'); }
            });
        }
    },

    init: function() {

        $('body').removeClass('stopped').addClass('running');

        augur.syncContract();

        // watch for augur contract changes
        web3.eth.filter(augur.contract).watch(function(log) {
            console.log('[augur] contract changed');
            augur.syncContract();
        });

        // watch for whisper based comments
        web3.shh.filter({
            topics: ['eventComment', 'marketComment'],
            to: augur.shhId
        }).watch(function(data) {
            console.log(data);
        });

        // user events
        $('.reporting form').on('submit', function(event) {

            event.preventDefault();

            var results = $(this).serializeArray();

            _.each(results, function(r, i) {
                results[i].branch = _decision[r.name].vote_id;
            });
        });

        $('#create-branch-modal form').on('submit', function(event) {

            event.preventDefault();
            var parent = parseInt($('#create-branch-modal .branch-parent').val());
            var branchName = $('#create-branch-modal .branch-name').val();

            var newBranch = augur.contract.call().createSubbranch(branchName, 5*60, parent);
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

            var newEvent = {
                branch: augur.data.currentBranch,
                text: $('#event-text').val(),
                matureBlock: $('#event-end-block').val(),
                matureDate: augur.blockToDate($('#event-end-block').val()),
                status: 'pending'
            };

            var id = augur.contract.call().createEvent(newEvent.branch, newEvent.text, newEvent.matureBlock, 0, 1, 2);

            if (id.toNumber() === 0) {
                var data = {
                    type: 'danger',
                    messages: ['Oops! Failed to add a new event.']
                };
                augur.render.alert(data);

            } else {

                augur.data.events[id.toNumber()] = newEvent;
                augur.render.events(augur.data.events);
            }

            $('#add-event-modal').modal('hide');
        });

        $('#add-market-modal form').on('submit', function(event) {

            event.preventDefault();

            var newMarket = {
                branch: augur.data.currentBranch,
                text: $('#market-text').val(),
                alpha: $('#market-alpha').val(),
                investment: $('#market-investment').val(),
                creator: augur.data.account,
                cumulativeScale: null,
                numOutcomes: null,
                tradingPeriod: null,
                fee: 10,
                events: [],
                status: 'pending'
            };

            var id = augur.contract.call().createMarket(newMarket.branch, newMarket.text, newMarket.alpha, newMarket.initial, newMarket.fee, newMarket.events);

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
            var address = $('#rep-dest-address').val();
            var amount = $('#send-rep-modal .rep-amount').val();
            var branch = $('#send-rep-modal .branch-id').val();

            if (augur.contract.call().sendReputation(branch, address, amount)) {
                $('#send-rep-modal').modal('hide');
            } else {
                console.log('[augur] failed to send reputation');
            }
        });

        $('#alert').on('closed.bs.alert', function() {
            $('#alert div').empty();
        });
    },

    syncNetwork: function() {

        augur.network.peerCount = web3.net.peerCount;
        augur.network.blockNumber = web3.eth.blockNumber;
        augur.network.gas = augur.formatGas(web3.eth.getBalance(augur.data.account));
        augur.network.gasPrice = augur.formatGas(web3.eth.gasPrice);

        // update period progress
        if (augur.data.branches[augur.data.currentBranch]) {
            augur.render.period(augur.data.branches[augur.data.currentBranch]);
        }

        augur.update(augur.network);
    },

    syncContract: function() {

        augur.data.account = web3.eth.accounts[0];
        augur.data.balance = augur.formatBalance(augur.contract.call().balance(augur.data.account));

        augur.getBranches();
        augur.getEvents(augur.data.currentBranch);
        augur.getMarkets(augur.data.currentBranch);

        augur.update(augur.data);
    },

    getBranches: function() {

        _.each(augur.contract.call().getBranches(), function(branchId) {

            var branchInfo = augur.contract.call().getBranchInfo(branchId);
            var branchName = augur.contract.call().getBranchDesc(branchId);
            var rep = augur.contract.call().getRepBalance(branchId, augur.data.account);
            if (branchId.toNumber() == 1010101) branchName = 'General';   // HACK

            augur.data.branches[branchId.toNumber()] = {
                name: branchName,
                currentPeriod: branchInfo[2].toNumber(),
                periodLength: branchInfo[3].toNumber(),
                rep: augur.formatBalance(rep)
            };
        });
    },

    getEvents: function(branchId) {

        _.each(augur.contract.call().getEvents(branchId), function(eventId) {

            var eventInfo = augur.contract.call().getEventInfo(eventId);
            var eventText = augur.contract.call().getEventDesc(eventId);

            augur.data.events[eventId.toNumber()] = {
                text: eventText,
                matureBlock: eventInfo[3].toNumber(),
                matureDate: augur.blockToDate(eventInfo[3].toNumber()),
                status: 'open'
            };
        });
    },

    getMarkets: function(branchId) {

        _.each(augur.contract.call().getMarkets(branchId), function(id) {

            var marketInfo = augur.contract.call().getMarketInfo(id);
            var marketText = augur.contract.call().getMarketDesc(id);

            augur.data.markets[id.toNumber()] = {
                text: marketText,
                volume: 12543,
                fee: marketInfo[7].toNumber(),
                buyPrice: 134.4,
                sellPrice: 133.2,
                delta: 1.3,
                status: 'open'
            };
        });
    },

    viewMarket: function(id) {

        $('#market h4').text(augur.data.markets[id].text);

        var data = google.visualization.arrayToDataTable([
            ['Date', 'Price'],
            ['7/20',  0.400],
            ['7/21',  0.412],
            ['7/22',  0.403],
            ['7/23',  0.378],
            ['7/24',  0.412],
            ['7/25',  0.478],
            ['7/26',  0.488],
            ['7/27',  0.475],
            ['7/28',  0.413],
            ['7/29',  0.400],
            ['7/30',  0.321],
            ['8/1',  0.389],
            ['8/2',  0.409],
            ['8/3',  0.413],
            ['8/4',  0.429],
            ['8/5',  0.444],
            ['8/6',  0.412],
            ['8/7',  0.429],
            ['8/8',  0.433],
            ['8/9',  0.500],
            ['8/10',  0.541],
            ['8/11',  0.622],
            ['8/12',  0.679]
        ]);

        var options = {
          title: 'Price',
          legend: { position: 'none' },
          backgroundColor: '#f9f6ea'
        };

        var chart = new google.visualization.LineChart(document.getElementById('market-chart'));

        $('#market').show();
        $('.markets').hide();
        $('.events').hide();

        chart.draw(data, options);

    },

    // helper for rendering several components
    update: function(data) {

        _.each(data, function (value, prop) {
            if (prop in augur.render) augur.render[prop](value);
        });
    },

    // DOM manipulation (convert to React or Mercury?)
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

            // clean up current period
            data.currentPeriod = data.currentPeriod == -1 ? 0 : data.currentPeriod;

            var periodStart = data.periodLength * data.currentPeriod;
            var periodEnd = periodStart + data.periodLength;
            var periodAt = augur.network.blockNumber - periodStart;
            var periodPercent = (periodAt/ data.periodLength) * 100;
            var periodEndDate = augur.blockToDate(periodEnd);

            $('.period h3 .branch-name').html(data.name);
            $('.period h3 .period-ending').html('Period ending ' + augur.formatDate(periodEndDate));
            $('.period-end-block').text(periodEnd);

            var phases = [{name: 'reporting', percent: periodPercent}];

            var template = _.template($("#progress-template").html());
            $('.period .progress').empty();
            _.each(phases, function(p) {
                $('.period .progress').append(template({'type': p.name, 'percent': p.percent}));
            });

            $('.period').show();
        },

        report: function(data) {

            $('.preiod').removeClass('reporting').removeClass('reveal').removeClass('svd').addClass(data.phase);

            if (!$.isEmptyObject(data)) {

                $('#report-decisions').empty();

                var h = $('<h4>').html('Report');
                var s = $('<span>').html('Ends at ' + augur.formatDate(data.reveal_date));
                var report_header = $('<li>').addClass('list-group-item').append([h, s]);
                $('#report-decisions').append(report_header);
                var template = _.template($("#report-template").html());
                _.each(data, function(d, id) {

                    if (d['state'] == '0') { d['state_desc'] = 'False' }
                    else if (d['state'] == '1') { d['state_desc'] = 'True' }
                    else if (d['state'] == '0.5') { d['state_desc'] = 'Ambiguous or Indeterminent' }
                    else { d['state_desc'] = 'Absent' }

                    $('#report-decisions').append(template({'d': d}));
                    $('#report input[name='+d.decision_id+']').attr('data-state', d.state);
                });

                $('#report').show();

                $('#report input[name]').on('change', function(e) {

                    var report = {'decision_id': $(this).attr('name'), 'state': $(this).val()};
                    var state = $('#report input[name='+$(this).attr('name')+']').attr('data-state');
                    var self = this;

                    if (state) {

                        var dialog = {
                            message: 'Changing this decision will incur and additional fee.  Are you sure you wish to change it?',
                            confirmText: 'Change',
                            confirmCallback: function() {
                                nodeMonitor.postMessage({'reportDecision': report});
                                $('#report input[name='+report.decision_id+']').attr('data-state', report.state);
                            },
                            cancelCallback: function() {
                                $('#report input[name='+report.decision_id+'][value="'+state+'"]').attr('checked', true);
                            }
                        };

                        augur.confirm(dialog);

                    } else {

                        nodeMonitor.postMessage({'reportDecision': report});
                        $('#report input[name='+report.decision_id+']').attr('data-state', report.state);
                        $('#'+report.decision_id).addClass('reported');

                    }
                });

            } else {

                $('#report').hide();
            }
        },

        branches: function(data) {

            if (!$.isEmptyObject(data)) {

                $('.branches').empty();

                // sort on reputation
                //data = data.sort(function(a,b) {return (a.rep > b.rep) ? -1 : ((b.rep > a.rep) ? 1 : 0);} );
                var has_branches = false;
                var has_others = false;

                _.each(data, function(branch, id) {

                    // update period for current branch
                    if (id == augur.data.currentBranch) augur.render.period(branch);

                    if (branch.rep) {

                        has_branches = true;
                        var p = $('<p>').html('<span class="pull-left"><b>'+branch.name+'</b> ('+branch.rep+')</span>').addClass('clearfix');
                        var send = $('<a>').attr('href','#').addClass('pull-right').text('send').on('click', function() {
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
        },

        currentBranch: function(id) {

            $('.branch-name').text(augur.data.branches[id].name);
            $('input.branch-id').val(id);
        },

        account: function(data) {

            $('.account .address').html(data);
        },

        blockNumber: function(data) {

            $('.blocks span').text(data);
            $('.blocks').show();
        },

        gas: function(data) {

            $('.gas span').text(data);
            $('.gas').show();
        },

        gasPrice: function(data) {

            $('.gas-price span').text(data);
            $('.gas-price').show();
        },

        host: function(data) {

            $('.host span').text(data);
            $('.host').show();
        },

        peerCount: function(data) {

            $('.peers span').text(data);
            $('.peers').show();
        },

        miner: function(data) {

            $('.miner span').text(data ? 'on' : 'off');
            $('.miner').show();
        },

        markets: function(data) {

            var markets = false;
            $('.markets tbody').empty();

            _.each(data, function(market, id) {

                if (market.branchId == augur.currentBranch) {
                    markets = true;
                    var row = $('<tr>').html('<td class="text">'+market.text+'</td><td>'+market.volume+'</td><td>'+market.fee+'</td>');
                    var trade = $('<a>').attr('href', '#').text('trade').on('click', function() {
                        console.log('trade');
                    });
                    if (market.status == 'open') {
                        var trade = $('<td>').append(trade).css('text-align', 'right');
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

            if (markets) {

                $('.no-markets').hide();
                $('.markets').show();

            } else {

                $('.markets').hide();
            }
        },

        events: function(data) {

            var events = false;
            $('.events tbody').empty();
            $('#market-events').empty();

            _.each(data, function(event, id) {

                if (event.branchId == augur.currentBranch) {
                    events = true;
                    var row = $('<tr>').html('<td class="text">'+event.text+'</td><td>'+augur.formatDate(event.matureDate)+'</td><td>'+event.status+'</td>');
                    $('.events tbody').append(row);
                    // populate add market modal form
                    var option = $('<option>').attr('value', id).text(event.text);
                    $('#market-events').append(option);
                }
            });

            if (events) {

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

        balance: function(data) {

            $('.balance').text(data);
        }
    },

    // utility functions
    blockToDate: function(block) {

        // calculate date from block number
        var seconds = (block - augur.network.blockNumber) * 12;
        var date = new Date();
        date.setSeconds(date.getSeconds() + seconds);

        return date;
    },

    formatBalance: function(value) {  // value must be a big number

        var x = new BigNumber(2);
        var y = x.toPower(64);

        return value.dividedBy(y).toString('10');
    },

    formatDate: function(d) {

        if (!d) return '-';

        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Oct','Sep','Nov','Dec'];

        var hour = d.getHours() > 11  ? d.getHours() - 12 : d.getHours();
        hour = hour === 0 ? 12 : hour;
        var apm = d.getHours() > 10 || d.getHours() == 23 && d.getHours() !== 0 ? 'pm' : 'am';
        var minutes = d.getMinutes() < 10 ? '0'+ d.getMinutes() : d.getMinutes();

        return months[d.getMonth()]+' '+d.getDate()+', '+hour+':'+minutes+' '+apm;
    },

    formatGas: function(wei) {

        // detect format and convert
        if (typeof(wei) === 'string' && wei.match(/^0x\w+/)) {
            wei = web3.toWei(wei, 'wei');
        } else {
            wei = wei.toNumber();
        }

        if (wei >= 1000000000000 && wei < 1000000000000000) {
            return wei / 1000000000000 + ' szabo';
        } else if (wei >= 1000000000000000 && wei < 1000000000000000000) {
            return wei / 1000000000000000 + ' finney';
        } else if (wei >= 1000000000000000000 && wei < 1000000000000000000000) {
            return wei / 1000000000000000000 + ' ether';
        } else {
            return wei + ' wei';
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

    abi:
[{
    "name": "api(int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "dataStructure", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "arrayIndex", "type": "int256" }, { "name": "ID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "balance(int256)",
    "type": "function",
    "inputs": [{ "name": "address", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "buyShares(int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }, { "name": "amount", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "createEvent(int256,string,int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "description", "type": "string" }, { "name": "expDate", "type": "int256" }, { "name": "minValue", "type": "int256" }, { "name": "maxValue", "type": "int256" }, { "name": "numOutcomes", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "createMarket(int256,string,int256,int256,int256,int256[])",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "description", "type": "string" }, { "name": "alpha", "type": "int256" }, { "name": "initialLiquidity", "type": "int256" }, { "name": "tradingFee", "type": "int256" }, { "name": "events", "type": "int256[]" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "createSubbranch(string,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "description", "type": "string" }, { "name": "periodLength", "type": "int256" }, { "name": "parent", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "faucet()",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getBranchDesc(int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "string" }]
},
{
    "name": "getBranchInfo(int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getBranches()",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getEventDesc(int256)",
    "type": "function",
    "inputs": [{ "name": "event", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "string" }]
},
{
    "name": "getEventInfo(int256)",
    "type": "function",
    "inputs": [{ "name": "event", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getEvents(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "expPeriod", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getMarketDesc(int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "string" }]
},
{
    "name": "getMarketEvents(int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getMarketInfo(int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getMarkets(int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getRepBalance(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "address", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getReputation(int256)",
    "type": "function",
    "inputs": [{ "name": "address", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "marketParticipantsApi(int256,int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "participantIndex", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "eventID", "type": "int256" }, { "name": "outcomeNumber", "type": "int256" }, { "name": "marketID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "price(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sellShares(int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }, { "name": "amount", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "send(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "recver", "type": "int256" }, { "name": "value", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sendFrom(int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "recver", "type": "int256" }, { "name": "value", "type": "int256" }, { "name": "from", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sendReputation(int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "recver", "type": "int256" }, { "name": "value", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "vote(int256,int256[],int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "report", "type": "int256[]" }, { "name": "votePeriod", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
}]
};

module.exports = augur;
