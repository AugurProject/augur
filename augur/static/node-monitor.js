console.log('[nodeMonitor] starting');

importScripts("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.3.0/lodash.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/bignumber.js/2.0.3/bignumber.min.js");
importScripts("https://raw.githubusercontent.com/ethereum/ethereum.js/master/dist/ethereum.min.js");

var abi = [
    {
        "name": "api(int256,int256,int256,int256)",
        "type": "function",
        "inputs": [{ "name": "dataStructure", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "arrayIndex", "type": "int256" }, { "name": "ID", "type": "int256" }],
        "outputs": [{ "name": "unknown_out", "type": "int256[]" }]
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
        "name": "calibrate_sets(int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "scores", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "calibrate_wsets(int256[],int256[],int256[],int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "set1", "type": "int256[]" }, { "name": "set2", "type": "int256[]" }, { "name": "reputation", "type": "int256[]" }, { "name": "reports", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "center(int256[],int256[],int256[],int256[],int256[],int256)",
        "type": "function",
        "inputs": [{ "name": "reports_filled", "type": "int256[]" }, { "name": "reputation", "type": "int256[]" }, { "name": "scaled", "type": "int256[]" }, { "name": "scaled_max", "type": "int256[]" }, { "name": "scaled_min", "type": "int256[]" }, { "name": "max_iterations", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "checkQuorum(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "closeBet(int256)",
        "type": "function",
        "inputs": [{ "name": "betID", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "closeMarket(int256,int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }],
        "outputs": [{ "name": "unknown_out", "type": "int256[]" }]
    },
    {
        "name": "consensus(int256[],int256[],int256[],int256[],int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "smooth_rep", "type": "int256[]" }, { "name": "reports", "type": "int256[]" }, { "name": "scaled", "type": "int256[]" }, { "name": "scaled_max", "type": "int256[]" }, { "name": "scaled_min", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
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
        "name": "eventsExpApi(int256,int256,int256,int256,int256)",
        "type": "function",
        "inputs": [{ "name": "expDateIndex", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "arrayIndexOne", "type": "int256" }, { "name": "arrayIndexTwo", "type": "int256" }, { "name": "ID", "type": "int256" }],
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
        "name": "interpolate(int256[],int256[],int256[],int256[],int256[])",
        "type": "function",
        "inputs": [{ "name": "reports", "type": "int256[]" }, { "name": "reputation", "type": "int256[]" }, { "name": "scaled", "type": "int256[]" }, { "name": "scaled_max", "type": "int256[]" }, { "name": "scaled_min", "type": "int256[]" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "makeBallot(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "makeBet(int256,int256)",
        "type": "function",
        "inputs": [{ "name": "eventID", "type": "int256" }, { "name": "amtToBet", "type": "int256" }],
        "outputs": []
    },
    {
        "name": "makeSubBranch(string,int256,int256,int256)",
        "type": "function",
        "inputs": [{ "name": "description", "type": "string" }, { "name": "periodLength", "type": "int256" }, { "name": "parent", "type": "int256" }, { "name": "repRequired", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "marketParticipantsApi(int256,int256,int256,int256,int256)",
        "type": "function",
        "inputs": [{ "name": "participantIndex", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "eventID", "type": "int256" }, { "name": "outcomeNumber", "type": "int256" }, { "name": "marketID", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "participation(int256[],int256[],int256[],int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "outcomes_final", "type": "int256[]" }, { "name": "consensus_reward", "type": "int256[]" }, { "name": "smooth_rep", "type": "int256[]" }, { "name": "reports_mask", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "pca_adjust(int256[],int256[],int256[],int256[],int256[],int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "old", "type": "int256[]" }, { "name": "new1", "type": "int256[]" }, { "name": "new2", "type": "int256[]" }, { "name": "set1", "type": "int256[]" }, { "name": "set2", "type": "int256[]" }, { "name": "scores", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "pca_loadings(int256[],int256[],int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "loading_vector", "type": "int256[]" }, { "name": "weighted_centered_data", "type": "int256[]" }, { "name": "reputation", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "pca_scores(int256[],int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "loading_vector", "type": "int256[]" }, { "name": "weighted_centered_data", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "redeem(int256,int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }, { "name": "step", "type": "int256" }],
        "outputs": [{ "name": "unknown_out", "type": "int256[]" }]
    },
    {
        "name": "reputationApi(int256,int256,int256)",
        "type": "function",
        "inputs": [{ "name": "reputationIndex", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "branchID", "type": "int256" }],
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
        "name": "sendMoneytoBet(int256,int256)",
        "type": "function",
        "inputs": [{ "name": "betID", "type": "int256" }, { "name": "outcome", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "sendReputation(int256,int256,int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }, { "name": "recver", "type": "int256" }, { "name": "value", "type": "int256" }],
        "outputs": [{ "name": "unknown_out", "type": "int256[]" }]
    },
    {
        "name": "smooth(int256[],int256[],int256,int256)",
        "type": "function",
        "inputs": [{ "name": "adjusted_scores", "type": "int256[]" }, { "name": "reputation", "type": "int256[]" }, { "name": "num_players", "type": "int256" }, { "name": "num_events", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "vote(int256,int256[])",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }, { "name": "report", "type": "int256[]" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    }
];

// get the web3 object
if (typeof web3 === 'undefined') {

    var web3 = require('web3');

    // set providor
    web3.setProvider(new web3.providers.HttpSyncProvider("http://localhost:8080"))
}

var address = '0x1b0d9c2449fb543016d2827e7342ec44a8dd7f09';   // this is the address returned from the loader
var contract = web3.eth.contract(address, abi);

console.log(contract);

var SECONDS_PER_BLOCK = 60;
var REPORT_CYCLE = 40;

var augur = {
    decisions: {},
    branches: {},
    markets: {},
    blockcount: 0,
    network_blockcount: 0,
    starting: false,
    current: false,
    market_queue: {},
    force: false,
    blocks_loaded: 0
}

var cycle = {
    count: 0,
    decisions: {}
};

var account = {};

function blockTime(block) {   // estimates time of given block

    var d = new Date();
    var seconds_diff = (block - augur.network_blockcount) * SECONDS_PER_BLOCK;
    d.setSeconds(d.getSeconds() + seconds_diff);

        </div>    return d;
}

socket.on('account', function (data) { 

    account = _.extend(account, data)

    self.postMessage({'address': account.address});
    self.postMessage({'cash': account.cash});
});

socket.on('miner', function (data) { 
    self.postMessage({'miner': data});
});

socket.on('market', function (m) { 

    if (m.decisions) {

        var decision_id = m['decisions'][0];

        if (augur.markets[decision_id]) {
            augur.markets[decision_id] = _.extend(augur.markets[decision_id], m);

            if (account.shares && account.shares[augur.markets[decision_id]['PM_id']]) {
                augur.markets[decision_id]['my_shares'] = account.shares[augur.markets[decision_id]['PM_id']]
            }
        }
    }
});

socket.on('blockcount', function (count) {

    if (augur.blockcount != count || augur.force) {

        augur.force = false;

        // be nice and wait for node to download blocks before trying to fetch a bunch
        if (augur.network_blockcount - count > 100) {

            self.postMessage({'downloading': {'total': augur.network_blockcount, 'current': count}});
            return;

        } else {

            self.postMessage({'downloading': {'done': true}});
        }

        var prev_blockcount = augur.blockcount;
        augur.blockcount = count;
        self.postMessage({'blockcount': count});

        socket.emit('update-account');

        var start_block = prev_blockcount + 1;

        // examine new blocks
        if (prev_blockcount != count) {

            console.log('[nodeMonitor] fetching blocks '+ start_block +' - '+augur.blockcount);

            var batches = parseInt((augur.blockcount - start_block) / 20);

            for (i = 0; i <= batches; i++) {

                var start = start_block + (i * 20);
                var end = start + 20 > augur.blockcount ? augur.blockcount : start + 20;

                //console.log('getting '+ start + ' - '+ end);
                socket.emit('get-blocks', start, end);
            }
        }

        // update markets 
        _.each(augur.markets, function(m) {
            socket.emit('update-market', m['PM_id']);
        });

        // check for maturing decisions
        var changes = false;
        _.each(augur.decisions, function(d) {
            if (d['status'] == 'open' && d['maturation'] <= augur.network_blockcount) {
                changes = true;
                augur.decisions[d['decision_id']]['status'], d['status'] = 'closed';

                // update associated market
                augur.markets[d['decision_id']] = _.extend(augur.markets[d['decision_id']], d);
            }
        });

        // update DOM if there are changes
        if (changes) self.postMessage({'markets': augur.markets});

        // check cycle reporting phase
        cycle_count = parseInt(augur.network_blockcount / REPORT_CYCLE);
        cycle['block'] = augur.network_blockcount - (cycle_count * REPORT_CYCLE);
        cycle['end_block'] = (cycle_count + 1) * REPORT_CYCLE;
        cycle['end_date'] = blockTime((cycle_count + 1) * REPORT_CYCLE);
        cycle['last_end_block'] = cycle_count * REPORT_CYCLE;
        cycle['last_end_date'] = blockTime(cycle_count * REPORT_CYCLE);
        cycle['reveal_block'] = parseInt(cycle['last_end_block'] + REPORT_CYCLE * 0.875);
        cycle['reveal_date'] = blockTime(cycle['reveal_block']);
        cycle['svd_block'] = parseInt(cycle['last_end_block'] + REPORT_CYCLE * 0.975);
        cycle['svd_date'] = blockTime(cycle['svd_block']);
        cycle['percent'] = (cycle['block'] / REPORT_CYCLE) * 100;
        cycle['phase'] = 'catching up';

        if (augur.current) {   // only reveal reporting details if we have parsed the blockchain and are current

            if (cycle_count != cycle['count']) {   // we're in a new cycle 

                cycle['count'] = cycle_count;
                console.log("[nodeMonitor] reporting cycle " + cycle['count']);
            
                // collect reporting decisions
                cycle['decisions'] = {};
                _.each(augur.decisions, function(d) {
                    if (d['status'] == 'closed' && _.has(account['branches'], d['vote_id']) && _.has(augur.markets, d['decision_id'])) {
                        cycle['decisions'][d['decision_id']] = d;
                    };
                });
            }

            // reporting phase
            if (augur.blockcount < cycle['reveal_block'] && cycle['phase'] != 'reporting') {  

                cycle['phase'] = 'reporting';

                // update reporting
                self.postMessage({'report': cycle});

            // reveal phase
            } else if (augur.blockcount >= cycle['reveal_block'] && augur.blockcount < cycle['svd_block'] && cycle['phase'] != 'reveal') {   

                cycle['phase'] = 'reveal';

                // reveal reports
                 _.each(cycle['decisions'], function(d) {
                    if (d.state) {   // we have reported on this decision 
                        socket.emit('reveal-vote', d['vote_id'], d['decision_id']);
                        console.log('[nodeMonitor] revealing vote ('+d['decision_id']+') in '+d['vote_id']);
                    }
                });

                // update reporting
                self.postMessage({'report': cycle});

            // SVD phase
            } else if (augur.blockcount >= cycle['svd_block'] && cycle['phase'] != 'svd') {

                cycle['phase'] = 'svd';

                // collect all branches voted on
                branches = {}

                _.each(cycle['decisions'], function(d) {

                    branches[d['vote_id']] = true;

                    // dedupe list and do SVD concensus on all voted branches
                    _.each(Object.keys(branches), function(branch) {
                        socket.emit('svd-consensus', branch);
                        console.log('[nodeMonitor] svd consensus for ' + branch);
                    });
                });

                // update reporting
                self.postMessage({'report': cycle});
            }
        }

        self.postMessage({'cycle': cycle});   // update cycle data

    }
});

socket.on('blocks', function (blocks) {

    if (blocks && blocks.length) {

        var messages = []

        _.each(blocks, function(block) {

            _.each(block['txs'], function(tx) {

                // build ledger of all account transactions
                //if (tx['pubkey'] == account['pubkey']) account['txs'].push(tx);

                if (tx['type'] == 'propose_decision') {

                    tx['status'] = tx['maturation'] > augur.network_blockcount ? 'open' : 'closed';
                    tx['maturation_date'] = blockTime(tx['maturation']);
                    if (account.decisions && account.decisions[tx['decision_id']]) {
                        tx['state'] = account.decisions[tx['decision_id']]
                    }
                    augur.decisions[tx['decision_id']] = tx;

                    // check to see if we're waiting for this decision to show up
                    if (augur.market_queue[tx['decision_id']]) {

                        socket.emit('add-market', augur.market_queue[tx['decision_id']]);
                        delete augur.market_queue[tx['decision_id']]
                    }

                    messages.push('New decision: ' + tx['txt'] + ' (' + tx['decision_id'] + ')');

                } else if (tx['type'] == 'prediction_market') {

                    var decision_id = tx['decisions'][0];

                    // augment market data with decision data
                    augur.markets[decision_id] = _.extend(tx, augur.decisions[decision_id]);

                    self.postMessage({'markets': augur.markets});

                } else if (tx['type'] == 'create_jury') {

                    augur.branches[tx.vote_id] = tx;

                    // check to see if we have any rep on this branch
                    if (_.has(account.branches, tx.vote_id)) {
                        augur.branches[tx.vote_id]['my_rep'] = account.branches[tx.vote_id];
                    }

                    self.postMessage({'branches': augur.branches});
                    messages.push('New branch: ' + tx['vote_id']);

                } else if (tx['type'] == 'spend') {

                    sender = 'unknown';
                    if (tx.vote_id) {
                        messages.push(sender + ' sent ' + tx['amount'] + ' ' + tx['vote_id'] + ' reputation to ' + tx['to']);
                    } else {
                        messages.push(sender + ' sent ' + tx['amount'] + ' cash to ' + tx['to']);
                    }
                
                } else if (tx['type'] == 'jury_vote') {

                    if (tx['old_vote'] == 'unsure') {

                        augur.decisions[tx['decision_id']]['reported'] = augur.decisions[tx['decision_id']]['reported'] ? augur.decisions[tx['decision_id']]['reported']++ : 1;
                    }

                }
            });

            augur.blocks_loaded++;

            // check to see if we have caught up and loaded all txs
            if (augur.blocks_loaded + 1 == augur.network_blockcount && !augur.current) {

                self.postMessage({'parsing': {'done': true}});
                augur.current = true;
                augur.force = true;

            } else {

                self.postMessage({'parsing': {'total': augur.network_blockcount, 'current': augur.blocks_loaded}});
            }
        });

        if (messages.length) self.postMessage({'alert': {'type': 'info', 'messages': messages}});
    }      
});

socket.on('peers', function (peers) {

    if (!augur.running) {
        socket.emit('get-account');
        augur.running = true;

        self.postMessage({'node-up': true});            
    }

    _.each(peers, function(data) {

        // update network blockcount to largest peers
        augur.network_blockcount = data.length > augur.network_blockcount ? data.length : augur.network_blockcount;
    });

    self.postMessage({'peers': peers});
});

socket.on('node-down', function() {

    // check to see if we were already running
    if  (augur.running || !_.has(augur, 'running')) {

        self.postMessage({'node-down': true});   
        augur.running = false;
    }
});

// message listeners from DOM script
self.addEventListener('message', function(message) {

    var m = message.data;

    // adding a pending decision to list until the blockchain confirms it
    if (m && m['add-decision']) {

        var tx = {
            'txt': m['add-decision']['decisionText'],
            'decision_id': m['add-decision']['decisionId'],
            'vote_id': m['add-decision']['branchId'],
            'maturation': m['add-decision']['decisionMaturation'],
            'status': 'pending'
        }

        augur.decisions[tx.decision_id] = tx;

        var tx = {
            'B': parseInt(m['add-decision']['marketInv']),
            'PM_id': m['add-decision']['decisionId'] + '.market',
            'decisions': [m['add-decision']['decisionId']],
            'decision_id': m['add-decision']['decisionId'],
            'fees': 0,
            'owner': account.address,
            'states': ['no', 'yes'],
            'type': 'prediction_market',
            'txt': m['add-decision']['decisionText'],
            'vote_id': m['add-decision']['branchId'],
            'maturation': m['add-decision']['decisionMaturation'],
            'maturation_date': blockTime(m['add-decision']['decisionMaturation']),
            'status': 'pending'
        }

        augur.markets[tx.decision_id] = tx;
        self.postMessage({'markets': augur.markets});

        augur.market_queue[m['add-decision'].decisionId] = m['add-decision'];

    } else if (m && m['report-decision']) {

        augur.decisions[m['report-decision']['decision_id']]['state'] = m['report-decision']['stage'];

        var data = _.extend(augur.decisions[m['report-decision']['decision_id']], m['report-decision']);
        socket.emit('report', data);

    } else if (m && m['trade']) {

        var id = m['trade'];

        self.postMessage({'trade': augur.markets[id]});
    }
});

// start pinging node for updates
setInterval(function() { socket.emit('ping') }, 2500);