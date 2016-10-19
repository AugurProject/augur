import augur from 'augur.js';
import { SUCCESS, SIMULATED_ORDER_BOOK, COMPLETE_SET_BOUGHT, ORDER_BOOK_ORDER_COMPLETE, ORDER_BOOK_OUTCOME_COMPLETE } from '../modules/transactions/constants/statuses';

const ex = {};

ex.connect = function connect(env, cb) {
	const options = {
		http: env.gethHttpURL,
		ws: env.gethWebsocketsURL,
		contracts: env.contracts,
		augurNodes: env.augurNodes
	};
	const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
	if (isHttps) {
		const isEnvHttps = (env.gethHttpURL && env.gethHttpURL.split('//')[0] === 'https:');
		const isEnvWss = (env.gethWebsocketsURL && env.gethWebsocketsURL.split('//')[0] === 'wss:');
		if (!isEnvHttps) options.http = null;
		if (!isEnvWss) options.ws = null;
	}
	if (options.http) augur.rpc.nodes.hosted = [options.http];
	augur.options.debug.trading = true;
	augur.options.debug.nonce = true;
	augur.rpc.debug.broadcast = false;
	augur.rpc.debug.tx = true;
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

ex.loadLoginAccount = function loadLoginAccount(env, cb) {
	const localStorageRef = typeof window !== 'undefined' && window.localStorage;

	// if available, use the client-side account
	if (augur.web.account.address && augur.web.account.privateKey) {
		console.log('using client-side account:', augur.web.account.address);
		return cb(null, {
			...augur.web.account,
			id: augur.web.account.address
		});
	}
	// if the user has a persistent login, use it
	if (localStorageRef && localStorageRef.getItem && localStorageRef.getItem('account')) {
		const account = JSON.parse(localStorageRef.getItem('account'));
		if (account && account.privateKey) {
			// local storage account exists, load it spawn the callback using augur.web.account
			augur.web.loadLocalLoginAccount(account, (loginAccount) =>
				cb(null, {
					...augur.web.account,
					id: augur.web.account.address
				})
			);
			//	break out of ex.loadLoginAccount as we don't want to login the local geth node.
			return;
		}
	}

	// Short circuit if autologin disabled in env.json
	if (!env.autoLogin) {
		return cb(null);
	}

	// local node: if it's unlocked, use the coinbase account
	// check to make sure the account is unlocked
	augur.rpc.unlocked(augur.from, (unlocked) => {

		// use augur.from address if unlocked
		if (unlocked && !unlocked.error) {
			augur.web.logout();
			console.log('using unlocked account:', augur.from);
			return cb(null, { address: augur.from, id: augur.from });
		}

		// otherwise, no account available
		console.log('account is locked: ', augur.from);
		return cb(null);
	});
};

ex.generateOrderBook = function generateOrderBook(marketData, cb) {
	augur.generateOrderBook({
		market: marketData.id,
		liquidity: marketData.initialLiquidity,
		initialFairPrices: marketData.initialFairPrices.raw,
		startingQuantity: marketData.startingQuantity,
		bestStartingQuantity: marketData.bestStartingQuantity,
		priceWidth: marketData.priceWidth,
		isSimulation: marketData.isSimulation,
		onSimulate: r => cb(null, { status: SIMULATED_ORDER_BOOK, payload: r }),
		onBuyCompleteSets: r => cb(null, { status: COMPLETE_SET_BOUGHT, payload: r }),
		onSetupOutcome: r => cb(null, { status: ORDER_BOOK_OUTCOME_COMPLETE, payload: r }),
		onSetupOrder: r => cb(null, { status: ORDER_BOOK_ORDER_COMPLETE, payload: r }),
		onSuccess: r => cb(null, { status: SUCCESS, payload: r }),
		onFailed: err => cb(err)
	});
};

// Setup a new branch and prep it for reporting tests:
// Add markets + events to it, trade in the markets, hit the Rep faucet
// (Note: requires augur.options.debug.tools = true and access to the rpc.personal API)
ex.reportingTestSetup = function reportingTestSetup(periodLen, cb) {
	if (!augur.tools) return cb('augur.js needs augur.options.debug.tools=true to run reportingTestSetup');
	const tools = augur.tools;
	const constants = augur.constants;
	const sender = augur.web.account.address || augur.from;
	const periodLength = periodLen || 900;
	const callback = cb || function callback(e, r) {
		if (e) console.error(e);
		if (r) console.log(r);
	};
	const accounts = augur.rpc.accounts();
	tools.DEBUG = true;
	tools.setup_new_branch(augur, periodLength, constants.DEFAULT_BRANCH_ID, [sender], (err, newBranchID) => {
		if (err) return callback(err);

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
		cb(null, 1, newBranchID);
		tools.create_each_market_type(augur, newBranchID, expDate, (err, markets) => {
			if (err) return callback(err);
			cb(null, 2);
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
			tools.top_up(augur, newBranchID, accounts, password, (err, unlocked) => {
				if (err) return callback(err);
				console.log('Unlocked:', unlocked);
				tools.trade_in_each_market(augur, 1, markets, unlocked[0], unlocked[1], password, (err) => {
					if (err) return callback(err);
					cb(null, 3);

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
						tools.top_up(augur, newBranchID, unlocked, password, (err, unlocked) => {
							if (err) console.error('top_up failed:', err);
							augur.checkPeriod(newBranchID, periodLength, sender, (err, votePeriod) => {
								if (err) console.error('checkVotePeriod failed:', err);
								callback(null, 6);
								tools.print_reporting_status(augur, eventID, 'After checkVotePeriod');
								augur.checkTime(newBranchID, eventID, periodLength, (err) => {
									if (err) console.error('checkTime failed:', err);
									callback(null, 7);
								});
							});
						});
					});
				});
			});
		});
	});
};

ex.fundNewAccount = function fundNewAccount(env, toAddress, branchID, onSent, onSuccess, onFailed) {
	if (env.fundNewAccountFromAddress && env.fundNewAccountFromAddress.amount) {
		augur.web.fundNewAccountFromAddress(env.fundNewAccountFromAddress.address || augur.from, env.fundNewAccountFromAddress.amount, toAddress, branchID, onSent, onSuccess, onFailed);
	} else {
		augur.web.fundNewAccountFromFaucet(toAddress, branchID, onSent, onSuccess, onFailed);
	}
};

ex.augur = augur;
ex.abi = augur.abi;
ex.constants = augur.constants;

module.exports = ex;
