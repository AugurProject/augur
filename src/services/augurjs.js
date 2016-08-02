import augur from 'augur.js';
import BigNumber from 'bignumber.js';
import { SUCCESS, CREATING_MARKET, SIMULATED_ORDER_BOOK, COMPLETE_SET_BOUGHT, ORDER_BOOK_ORDER_COMPLETE, ORDER_BOOK_OUTCOME_COMPLETE } from '../modules/transactions/constants/statuses';

const TIMEOUT_MILLIS = 50;
const ex = {};

ex.connect = function connect(env, cb) {
	const options = {
		http: env.gethHttpURL,
		ws: env.gethWebsocketsURL,
		contracts: env.contracts
	};
	if (window.location.protocol === 'https:') {
		const isEnvHttps = (env.gethHttpURL && env.gethHttpURL.split('//')[0] === 'https:');
		const isEnvWss = (env.gethWebsocketsURL && env.gethWebsocketsURL.split('//')[0] === 'wss:');
		if (!isEnvHttps) options.http = null;
		if (!isEnvWss) options.ws = null;
	}
	if (options.http) {
		augur.rpc.nodes.hosted = [options.http];
	}
	augur.connect(options, (connection) => {
		if (!connection) return cb('could not connect to ethereum');
		console.log('connected:', connection);
		cb(null, connection);
	});
};

ex.loadCurrentBlock = function loadCurrentBlock(cb) {
	augur.rpc.blockNumber((blockNumber) => cb(parseInt(blockNumber, 16)));
};

ex.loadBranches = function loadBranches(cb) {
	augur.getBranches((branches) => {
		if (!branches || branches.error) {
			console.log('ERROR getBranches', branches);
			cb(branches);
		}
		cb(null, branches);
	});
};

ex.loadBranch = function loadBranch(branchID, cb) {
	const branch = {};

	function finish() {
		if (branch.periodLength && branch.description) {
			cb(null, branch);
		}
	}

	augur.getPeriodLength(branchID, periodLength => {
		if (!periodLength || periodLength.error) {
			console.info('ERROR getPeriodLength', periodLength);
			return cb(periodLength);
		}
		branch.periodLength = periodLength;
		finish();
	});

	augur.getDescription(branchID, description => {
		if (!description || description.error) {
			console.info('ERROR getDescription', description);
			return cb(description);
		}
		branch.description = description;
		finish();
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
			augur.web.loadLocalLoginAccount(account, (loginAccount) => cb(null, loginAccount));
		}
	}

	// Short circuit if autologin disabled in env.json
	if (!env.autoLogin) {
		return cb(null);
	}

	// local node: if it's unlocked, use the coinbase account
	// check to make sure the account is unlocked
	augur.rpc.unlocked(augur.from, (unlocked) => {
		// use from/coinbase if unlocked
		if (unlocked && !unlocked.error) {
			console.log('using unlocked account:', augur.from);
			return cb(null, {
				id: augur.from
			});
		}

		// otherwise, no account available
		console.log('account is locked: ', augur.from);
		return cb(null);
	});
};

ex.loadAssets = function loadAssets(branchID, accountID, cbEther, cbRep, cbRealEther) {
	augur.getCashBalance(accountID, (result) => {
		if (!result || result.error) {
			return cbEther(result);
		}
		return cbEther(null, augur.abi.number(result));
	});

	augur.getRepBalance(branchID, accountID, (result) => {
		if (!result || result.error) {
			return cbRep(result);
		}
		return cbRep(null, augur.abi.number(result));
	});

	augur.rpc.balance(accountID, (wei) => {
		if (!wei || wei.error) {
			return cbRealEther(wei);
		}
		return cbRealEther(null, augur.abi.bignum(wei).dividedBy(new BigNumber(10).toPower(18)).toNumber());
	});
};

ex.loadMarkets = function loadMarkets(branchID, chunkSize, isDesc, chunkCB) {

	// load the total number of markets
	augur.getNumMarketsBranch(branchID, numMarketsRaw => {
		const numMarkets = parseInt(numMarketsRaw, 10);
		const firstStartIndex = isDesc ? Math.max(numMarkets - chunkSize + 1, 0) : 0;

		// load markets in batches
		getMarketsInfo(branchID, firstStartIndex, chunkSize, numMarkets, isDesc);
	});

	// load each batch of marketdata sequentially and recursively until complete
	function getMarketsInfo(branchID, startIndex, chunkSize, numMarkets, isDesc) {
		augur.getMarketsInfo({
			branch: branchID,
			offset: startIndex,
			numMarketsToLoad: chunkSize
		}, marketsData => {
			if (!marketsData || marketsData.error) {
				chunkCB(marketsData);
			} else {
				chunkCB(null, marketsData);
			}

			if (isDesc && startIndex > 0) {
				setTimeout(() => getMarketsInfo(branchID, Math.max(startIndex - chunkSize, 0), chunkSize, numMarkets, isDesc), TIMEOUT_MILLIS);
			} else if (!isDesc && startIndex < numMarkets) {
				setTimeout(() => getMarketsInfo(branchID, startIndex + chunkSize, chunkSize, numMarkets, isDesc), TIMEOUT_MILLIS);
			}
		});
	}
};

ex.batchGetMarketInfo = function batchGetMarketInfo(marketIDs, cb) {
	augur.batchGetMarketInfo(marketIDs, (res) => {
		if (res && res.error) {
			cb(res);
		}
		cb(null, res);
	});
};

ex.listenToUpdates = function listenToUpdates(cbBlock, cbContracts, cbPrice, cbCreation) {
	augur.filters.listen({
		// listen for new blocks
		block: (blockHash) => cbBlock(null, blockHash),
		// listen for augur transactions
		contracts: (filtrate) => cbContracts(null, filtrate),
		// update market when a price change has been detected
		price: (result) => cbPrice(null, result),
		// listen for new markets
		marketCreated: (result) => cbCreation(null, result)
	}, (filters) => console.log('### listen to filters:', filters));
};

ex.loadAccountTrades = function loadAccountTrades(accountID, cb) {
	augur.getAccountTrades(accountID, null, (accountTrades) => {
		if (!accountTrades) {
			return cb();
		}
		if (accountTrades.error) {
			return cb(accountTrades);
		}
		return cb(null, accountTrades);
	});
};

ex.listenToBidsAsks = function listenToBidsAsks() {

};

ex.login = function login(secureLoginID, password, cb) {
	augur.web.login(secureLoginID, password, (account) => {
		if (!account) {
			return cb({ code: 0, message: 'failed to login' });
		}
		if (account.error) {
			return cb({ code: account.error, message: account.message });
		}
		return cb(null, {
			...account,
			id: account.address
		});
	});
};

ex.logout = function logout() {
	augur.web.logout();
};

ex.register = function register(name, password, cb) {
	augur.web.register(name, password,
		account => {
			if (!account) {
				return cb({ code: 0, message: 'failed to register' });
			}
			if (account.error) {
				return cb({ code: account.error, message: account.message });
			}
			return cb(null, {
				...account,
				id: account.address
			});
		});
};

ex.loadMeanTradePrices = function loadMeanTradePrices(accountID, cb) {
	if (!accountID) {
		cb('AccountID required');
	}
	augur.getAccountMeanTradePrices(accountID, meanTradePrices => {
		if (meanTradePrices && meanTradePrices.error) {
			return cb(meanTradePrices);
		}
		cb(null, meanTradePrices);
	});
};

ex.getSimulatedBuy = function getSimulatedBuy(marketID, outcomeID, numShares) {
	return augur.getSimulatedBuy(marketID, outcomeID, numShares);
};

ex.getSimulatedSell = function getSimulatedSell(marketID, outcomeID, numShares) {
	return augur.getSimulatedSell(marketID, outcomeID, numShares);
};

ex.loadPriceHistory = function loadPriceHistory(marketID, cb) {
	if (!marketID) {
		return cb('ERROR: loadPriceHistory() marketID required');
	}
	augur.getMarketPriceHistory(marketID, (priceHistory) => {
		if (priceHistory && priceHistory.error) {
			return cb(priceHistory.error);
		}
		cb(null, priceHistory);
	});
};

ex.get_trade_ids = function getTradeIds(marketID, cb) {
	augur.get_trade_ids(marketID, cb);
};

ex.getOrderBook = function getOrderBook(marketID, scalarMinMax, cb) {
	augur.getOrderBook(marketID, scalarMinMax, cb);
};

ex.get_trade = function getTrade(orderID, cb) {
	augur.get_trade(orderID, cb);
};

ex.getCurrentPeriod = augur.getCurrentPeriod.bind(augur);
ex.getCurrentPeriodProgress = augur.getCurrentPeriodProgress.bind(augur);

ex.cancel = function cancel(orderId, onSent, onSuccess, onFailure) {
	augur.cancel(orderId, onSent, onSuccess, onFailure);
};

ex.createMarket = function createMarket(branchId, newMarket, cb) {
	augur.createSingleEventMarket({
		description: newMarket.formattedDescription,
		expDate: newMarket.endDate.value.getTime() / 1000,
		minValue: newMarket.minValue,
		maxValue: newMarket.maxValue,
		numOutcomes: newMarket.numOutcomes,
		resolution: newMarket.expirySource,
		takerFee: newMarket.takerFee / 100,
		tags: newMarket.tags,
		makerFee: newMarket.makerFee / 100,
		extraInfo: newMarket.detailsText,
		onSent: r => cb(null, { status: CREATING_MARKET, txHash: r.txHash }),
		onSuccess: r => cb(null, { status: SUCCESS, marketID: r.marketID, tx: r }),
		onFailed: r => cb(r),
		branchId
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

ex.getReport = function getReport(branchID, reportPeriod, eventID) {
	augur.getReport(branchID, reportPeriod, eventID, (report) =>
		console.log('*************report', report));
};

ex.loadPendingReportEventIDs = function loadPendingReportEventIDs(eventIDs, accountID, reportPeriod, branchID, cb) {
	return cb(null, {});
};

ex.submitReportHash = function submitReportHash(branchID, accountID, event, report, cb) {
	const minValue = augur.abi.bignum(event.minValue);
	const maxValue = augur.abi.bignum(event.maxValue);
	const numOutcomes = augur.abi.bignum(event.numOutcomes);
	let rescaledReportedOutcome;

	// Re-scale scalar/categorical reports so they fall between 0 and 1
	if (report.isIndeterminate) {
		rescaledReportedOutcome = report.reportedOutcomeID;
	} else {
		if (report.isScalar) {
			rescaledReportedOutcome = augur.abi.bignum(report.reportedOutcomeID)
												.minus(minValue)
												.dividedBy(maxValue.minus(minValue))
												.toFixed();
		} else if (report.isCategorical) {
			rescaledReportedOutcome = augur.abi.bignum(report.reportedOutcomeID)
												.minus(augur.abi.bignum(1))
												.dividedBy(numOutcomes.minus(augur.abi.bignum(1)))
												.toFixed();
		} else {
			rescaledReportedOutcome = report.reportedOutcomeID;
		}
	}

	const reportHash = augur.makeHash(
		report.salt,
		rescaledReportedOutcome,
		event.id,
		accountID,
		report.isIndeterminate,
		report.isScalar
	);

	augur.submitReportHash({
		branch: branchID,
		reportHash,
		reportPeriod: report.reportPeriod,
		eventID: event.id,
		eventIndex: event.index,
		onSent: res => cb(null, { ...res, reportHash, status: 'processing...' }),
		onSuccess: res => cb(null, { ...res, reportHash, status: SUCCESS }),
		onFailed: err => cb(err)
	});
};

ex.penalizationCatchup = function penalizationCatchup(branchID, cb) {
	augur.penalizationCatchup({
		branch: branchID,
		onSent: res => {
			console.log('penalizationCatchup sent:', res);
		},
		onSuccess: res => {
			console.log('penalizationCatchup success:', res);
			cb(null, res);
		},
		onFailed: err => {
			console.error('penalizationCatchup failed:', err);
			if (err.error === '0') {
				// already caught up
			}
			cb(err);
		}
	});
};

ex.penalizeWrong = function penalizeWrong(branchID, period, event, cb) {
	augur.getMarkets(event, markets => {
		if (!markets || markets.error) return console.error('getMarkets:', markets);

		/*
		augur.getOutcome(event, outcome => {
			if (outcome !== '0' && !outcome.error) {
				console.log('Calling penalizeWrong for:', branchID, period, event);
				augur.penalizeWrong({
					branch: branchID,
					event,
					onSent: res => {
						console.log(`penalizeWrong sent for event ${event}`, res);
					},
					onSuccess: res => {
						console.log(`penalizeWrong success for event ${event}`, res);
						cb(null, res);
					},
					onFailed: err => {
						console.error(`penalizeWrong failed for event ${event}`, err);
						if (err.error === '-3') {
							augur.penalizeNotEnoughReports(branchID, (error, res) => {
								self.penalizeWrong(branchID, period, event, cb);
							});
						}
						cb(err);
					}
				});
			} else {
				self.closeMarket(branchID, markets[0], (err, res) => {
					if (err) return cb(err);
					self.penalizeWrong(branchID, period, event, cb);
				});
			}
		});
		*/
	});
};

ex.closeMarket = function closeMarket(branchID, marketID, cb) {
	augur.closeMarket({
		branch: branchID,
		market: marketID,
		sender: augur.from,
		onSent: res => {
			// console.log('closeMarket sent:', res);
		},
		onSuccess: res => {
			// console.log('closeMarket success:', res);
			cb(null, res);
		},
		onFailed: err => {
			// console.error('closeMarket error:', err);
			cb(err);
		}
	});
};

ex.collectFees = function collectFees(branchID, cb) {
	augur.getPeriodLength(branchID, periodLength => {
		augur.collectFees({
			branch: branchID,
			sender: augur.from,
			periodLength,
			onSent: res => {
			},
			onSuccess: res => {
				cb(null, res);
			},
			onFailed: err => {
				cb(err);
			}
		});
	});
};

ex.incrementPeriodAfterReporting = function incrementPeriodAfterReporting(branchID, cb) {
	augur.incrementPeriodAfterReporting({
		branch: branchID,
		onSent: (result) => {},
		onFailed: (err) => cb(err),
		onSuccess: (result) => cb(null, result)
	});
};

ex.getReportPeriod = function getReportPeriod(branchID, cb) {
	augur.getVotePeriod(branchID, (res) => {
		if (res.error) {
			return cb(res);
		}
		return cb(null, res);
	});
};

ex.submitReport = function submitReport(...args) {
	augur.submitReport.apply(augur, args);
};

ex.getEvents = function getEvents(...args) {
	augur.getEvents.apply(augur, args);
};

ex.fundNewAccount = function fundNewAccount(env, toAddress, branchID, onSent, onSuccess, onFailed) {
	if (env.fundNewAccountFromAddress) {
		augur.web.fundNewAccountFromAddress(env.fundNewAccountFromAddress.address, env.fundNewAccountFromAddress.amount, toAddress, branchID, onSent, onSuccess, onFailed);
	} else {
		augur.web.fundNewAccountFromFaucet(toAddress, branchID, onSent, onSuccess, onFailed);
	}
};

ex.changeAccountName = function changeAccountName(name, cb) {
	augur.web.changeAccountName(name, account => {
		if (!account) {
			return cb({ code: 0, message: 'failed to edit account name' });
		}
		return cb(null, account);
	});
};

ex.rpc = augur.rpc;
ex.getTradingActions = augur.getTradingActions;
ex.trade = augur.trade;
ex.buy = augur.buy;

module.exports = ex;
