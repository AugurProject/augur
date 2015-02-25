(function () {

    // node monitoring webworker thread
    var nodeMonitorBlob = new Blob([$('#nodeMonitor').text()]);
    var nodeMonitor = new Worker(window.URL.createObjectURL(nodeMonitorBlob));

    // worker error handling
    nodeMonitor.addEventListener('error', function(e) {
        console.log('[augur] line '+ e.lineno,': ' +e.message);
    }, false);

    // nodeMonitor message listener
    nodeMonitor.addEventListener('message', function(m) {
    
        _.each(m.data, function (data, prop) {

            if (prop in update) {

                update[prop](data);

            } else {

                console.log('[augur] unknown message type: '+prop);
            }
        });

    }, false);

    // start node monitor web worker
    nodeMonitor.postMessage();


    // DOM manipulation (TODO: move to React or Mercury)
    var update = {

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

        cycle: function(data) {

            if (data.phase == 'catching up') {
                var phase = $('<i>').text(data.phase);
            } else {
                var phase = $('<span>').text(data.phase);
            }
            $('.cycle h3').html('Cycle ending ' + formatDate(data.end_date)).append(phase);

            if (data.percent > 97.5) {
                var phases = [{name: 'reporting', percent: 87.5}, {name: 'reveal', percent: 10}, {name: 'svd', percent: data.percent - 97.5}];
            } else if (data.percent > 87.5) {
                var phases = [{name: 'reporting', percent: 87.5}, {name: 'reveal', percent: data.percent - 87.5}];
            } else {
                var phases = [{name: 'reporting', percent: data.percent}];
            }

            var template = _.template($("#progress-template").html());
            $('.cycle .progress').empty();
            _.each(phases, function(p) {
                $('.cycle .progress').append(template({'type': p.name, 'percent': p.percent}))
            });

            $('.cycle').show();
        },

        report: function(data) {

            $('.cycle').removeClass('reporting').removeClass('reveal').removeClass('svd').addClass(data.phase);

            if (!$.isEmptyObject(data.decisions)) {

                $('#report-decisions').empty();

                var h = $('<h4>').html('Report');
                var s = $('<span>').html('Ends at ' + formatDate(data.reveal_date));
                var report_header = $('<li>').addClass('list-group-item').append([h, s]);
                $('#report-decisions').append(report_header);
                var template = _.template($("#report-template").html());
                _.each(data.decisions, function(d, id) {

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
                        }
                        
                        confirm(dialog);

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

            if (!$.isEmptyObject(data.branches)) {

                $('.branches').empty()

                // sort on reputation
                //m['branches'] = m['branches'].sort(function(a,b) {return (a.my_rep > b.my_rep) ? -1 : ((b.my_rep > a.my_rep) ? 1 : 0);} );
                var has_branches = false;

                _.each(mdata.branches, function(branch) {

                    data.branches[branch['vote_id']] = branch;   // update local branches

                    // update add decision modal
                    $('#decision-branch').append($('<option>').val(branch.vote_id).text(branch.vote_id));

                    if (branch.my_rep) {

                        has_branches = true;
                        var p = $('<p>').html('<span class="pull-left"><b>'+branch.vote_id+'</b> ('+branch.my_rep+')</span>').addClass('clearfix');
                        var send = $('<a>').attr('href','#').addClass('pull-right').text('send').on('click', function() {
                            $('#rep-branch').val(branch.vote_id);
                            $('#send-rep-modal .branch').text(branch.vote_id);
                            $('#send-rep-modal').modal('show');
                        })
                        p.append(send);

                    } else {
                        var p = $('<p class="other">').html('<span>'+branch.vote_id+'</span>');
                    }
                    $('.branches').append(p);
                });

                var bt = $('<a>').addClass('pull-right branches-toggle').on('click', function(event) {
                    $('.branches').toggleClass('all');
                });
                $('.branches').append(bt);

            } else {

                var p = $('<p>').html('<span class="pull-left">There are no branches</span>');
                $('.branches').empty().append(p);
            }
        },

        account: function(data) {

            $('.account .address').html(data);
        },

        blockNumber: function(data) {

            $('.blocks span').text(data);
            $('.blocks').show();
        },

        ether: function(data) {

            $('.ether span').text(data);
            $('.ether').show();
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

            if (!$.isEmptyObject(data)) {

                $('.decisions').empty();
                _.each(data, function(m) {

                    if (m) {
                        var row = $('<tr>').html('<td class="text">'+m.txt+'</td><td>'+m.vote_id+'</td><td>'+formatDate(m.maturation_date)+'</td>');
                        var trade = $('<a>').attr('href', '#').text('trade').on('click', function() {
                            nodeMonitor.postMessage({'trade': m.decision_id});
                        });
                        if (m.status == 'open') {
                            var trade = $('<td>').append(trade).css('text-align', 'right');
                        } else if (m.status == 'pending') {
                            var trade = $('<td>').text('pending').css('text-align', 'right');
                        } else {
                            var trade = $('<td>').text('closed').css('text-align', 'right');
                        }
                        $(row).append(trade);
                        $('.decisions').append(row);
                    }
                });
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
    }

    // utility functions
    function formatDate(d) {

        if (!d) return '-';

        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Oct','Sep','Nov','Dec'];

        var hour = d.getHours() > 11  ? d.getHours() - 12 : d.getHours();
        hour = hour == 0 ? 12 : hour;
        var apm = d.getHours() > 10 || d.getHours() == 23 && d.getHours() != 0 ? 'pm' : 'am';
        var minutes = d.getMinutes() < 10 ? '0'+ d.getMinutes() : d.getMinutes();
  
        return months[d.getMonth()]+' '+d.getDate()+', '+hour+':'+minutes+' '+apm;
    }

    function confirm(args) {

        $('#confirm-modal .message').html(args.message);
        if (args.cancelText) $('#confirm-modal button.cancel').text(args.cancelText);
        if (args.confirmText) $('#confirm-modal button.confirm').text(args.confirmText);

        $('#confirm-modal button.confirm').on('click', args.confirmCallback);
        $('#confirm-modal button.cancel').on('click', args.cancelCallback);

        $('#confirm-modal').modal('show');
    }

    // user events
    $('#password-form').on('submit', function(event) {

        event.preventDefault();
        //socket.emit('start', $('#password').val());
        $(this).hide();
        $('#start-node').button('loading');
        $('#start-node').show();
        $('#password-modal').modal('hide');
    });

    $('.reporting form').on('submit', function(event) {

        event.preventDefault();

        var results = $(this).serializeArray();

        _.each(results, function(r, i) {
            results[i]['branch'] = _decision[r.name].vote_id;
        });

        //socket.emit('report', results);
    }); 

    $('#create-branch-modal form').on('submit', function(event) {

        event.preventDefault();
        //socket.emit('create-branch', $('#branch-id').val());
        $('#create-branch-modal').modal('hide');
    });

    $('#add-decision-modal form').on('submit', function(event) {

        event.preventDefault();

        var args = {
            'branchId': $('#decision-branch').val(),
            'decisionText': $('#decision-text').val(),
            'decisionMaturation': $('#decision-time').val(),
            'marketInv': $('#market-investment').val()
        }

        //socket.emit('add-decision', args);
        $('#add-decision-modal').modal('hide');
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
        }
        //socket.emit('trade', args);
        $('#trade-modal').modal('hide');
    });
    $('#trade-modal input[name=trade-type]').on('change', function(event) {
       $('#trade-modal button.trade').text($(this).val()).removeAttr('disabled');
    });

    $('#send-rep-modal form').on('submit', function(event) {

        event.preventDefault();
        var address = $('#rep-dest-address').val();
        var amount = $('#rep-amount').val();
        var branch = $('#rep-branch').val();
        
        //socket.emit('send-reps', address, amount, branch);
        $('#send-rep-modal').modal('hide');
    });

    $('#alert').on('closed.bs.alert', function() {
        $('#alert div').empty();
    });



})();


// global objects for console debugging
// global these objects for console debuging
if (typeof web3 === 'undefined') {
    var web3 = require('web3');
    web3.setProvider(new web3.providers.HttpSyncProvider())
}
var abi = [
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
    "name": "faucet()",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getRepBalance(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "address", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "makeSubBranch(string,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "description", "type": "string" }, { "name": "periodLength", "type": "int256" }, { "name": "parent", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sellShares(int256,int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }, { "name": "amount", "type": "int256" }, { "name": "participantNumber", "type": "int256" }],
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
    "outputs": [{ "name": "unknown_out", "type": "int256[]" }]
}];
var address = '0x24dd2b80f42ec451cbaae0a9aff95aa432ef25dd';
var contract = web3.eth.contract(address, abi);