import augurJS from 'augur.js';

export const connect = function connect(env, cb) {
  const options = {
    http: env.gethHttpURL,
    ws: env.gethWebsocketsURL,
    contracts: env.contracts,
    augurNodes: env.augurNodes,
    noFallback: !env.hostedNodeFallback
  };
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  if (isHttps) {
    const isEnvHttps = (env.gethHttpURL && env.gethHttpURL.split('//')[0] === 'https:');
    const isEnvWss = (env.gethWebsocketsURL && env.gethWebsocketsURL.split('//')[0] === 'wss:');
    if (!isEnvHttps) options.http = null;
    if (!isEnvWss) options.ws = null;
  }
  augur.options.debug.trading = env.debug.trading;
  augur.options.debug.reporting = env.debug.reporting;
  augur.options.debug.nonce = false;
  augur.rpc.debug.broadcast = env.debug.broadcast;
  augur.rpc.debug.tx = false;
  augur.connect(options, (connection) => {
    if (!connection) return cb('could not connect to ethereum');
    console.log('connected:', connection);
    if (env.augurNodeURL && !isHttps) {
      console.debug('fetching cached data from', env.augurNodeURL);
      augur.augurNode.bootstrap([env.augurNodeURL]);
    }
    cb(null, connection);
  });
};

export const reportingMarketsSetup = function reportingMarketsSetup(periodLength, branchID, cb) {
  const tools = augur.tools;
  tools.DEBUG = true;
  const accounts = augur.rpc.accounts();
  const sender = augur.accounts.account.address || augur.from;
  const callback = cb || function callback(e, r) {
    if (e) console.error(e);
    if (r) console.log(r);
  };

  // create an event (and market) of each type on the new branch
  const t = new Date().getTime() / 1000;
  const untilNextPeriod = periodLength - (parseInt(t, 10) % periodLength);
  const expDate = parseInt(t + untilNextPeriod + 1, 10);
  const expirationPeriod = Math.floor(expDate / periodLength);
  console.debug('\nCreating events/markets...');
  console.log('Next period starts at time', parseInt(t, 10) + untilNextPeriod + ' (' + untilNextPeriod + ' seconds to go)');
  console.log('Current timestamp:', parseInt(t, 10));
  console.log('Expiration time:  ', expDate);
  console.log('Expiration period:', expirationPeriod);
  callback(null, 1, branchID);
  tools.create_each_market_type(augur, branchID, expDate, (err, markets) => {
    if (err) return callback(err);
    callback(null, 2);
    const events = {};
    const types = Object.keys(markets);
    const numTypes = types.length;
    for (let i = 0; i < numTypes; ++i) {
      events[types[i]] = augur.getMarketEvent(markets[types[i]], 0);
    }
    const eventID = events.binary;
    console.debug('Binary event:', events.binary);
    console.debug('Categorical event:', events.categorical);
    console.debug('Scalar event:', events.scalar);

    // make a single trade in each new market
    const password = process.env.GETH_PASSWORD;
    tools.make_order_in_each_market(augur, 1, markets, accounts[1], accounts[2], password, (err) => {
      if (err) return callback(err);
      callback(null, 3);

      // wait until the period after the new events expire
      tools.wait_until_expiration(augur, events.binary, (err) => {
        if (err) return callback(err);
        callback(null, 4);
        const periodLength = augur.getPeriodLength(augur.getBranch(eventID));
        const expirationPeriod = Math.floor(augur.getExpiration(eventID) / periodLength);
        tools.print_reporting_status(augur, eventID, 'Wait complete');
        console.log('Current period:', augur.getCurrentPeriod(periodLength));
        console.log('Expiration period + 1:', expirationPeriod + 1);
        callback(null, 5);

        // wait for second period to start
        augur.checkPeriod(branchID, periodLength, sender, (err, votePeriod) => {
          if (err) console.error('checkVotePeriod failed:', err);
          callback(null, 6);
          tools.print_reporting_status(augur, eventID, 'After checkVotePeriod');
          augur.checkTime(branchID, eventID, periodLength, (err) => {
            if (err) console.error('checkTime failed:', err);
            callback(null, 7);
          });
        });
      });
    });
  });
};

// Setup a new branch and prep it for reporting tests:
// Add markets + events to it, trade in the markets, hit the Rep faucet
// (Note: requires augur.options.debug.tools = true and access to the rpc.personal API)
export const reportingTestSetup = function reportingTestSetup(periodLen, branchID, cb) {
  const self = this;
  if (!augur.tools) return cb('augur.js needs augur.options.debug.tools=true to run reportingTestSetup');
  const tools = augur.tools;
  const constants = augur.constants;
  const sender = augur.accounts.account.address || augur.from;
  const periodLength = periodLen || 1200;
  const callback = cb || function callback(e, r) {
    if (e) console.error(e);
    if (r) console.log(r);
  };
  tools.DEBUG = true;
  if (branchID) {
    return augur.getPeriodLength(branchID, (branchPeriodLength) => {
      console.debug('Using branch', branchID, 'for reporting tests, reporting cycle length', branchPeriodLength);
      self.reportingMarketsSetup(branchPeriodLength, branchID, callback);
    });
  }
  console.debug('Setting up new branch for reporting tests...');
  tools.setup_new_branch(augur, periodLength, constants.DEFAULT_BRANCH_ID, [sender], (err, newBranchID) => {
    if (err) return callback(err);
    self.reportingMarketsSetup(periodLength, newBranchID, callback);
  });
};

export const augur = augurJS;
export const rpc = augur.rpc;
export const abi = augur.abi;
export const accounts = augur.accounts;
export const constants = augur.constants;
export const utils = augur.utils;
