import augur from 'augur.js';
import abi from 'augur-abi';
import BigNumber from 'bignumber.js';

import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../modules/transactions/constants/statuses';

var TIMEOUT_MILLIS = 50,
	ex = {};

ex.connect = function(cb) {
	// augur.rpc.nodes.hosted = ["https://report.augur.net"];
	augur.connect(null, null, function (connected) {
		console.log("augurjs.connect:", connected);
		if (!connected) return cb("your failure has been noted");
		cb(null, connected);
	});
};

ex.loadCurrentBlock = function(cb) {
	augur.rpc.blockNumber(function (blockNumber) {
		cb(parseInt(blockNumber));
	});
};

ex.loadBranches = function(cb) {
	augur.getBranches(function (branches) {
		if (!branches || branches.error) {
			console.log('ERROR getBranches', branches);
			cb(branches);
		}
		cb(null, branches);
	});
};

ex.loadBranch = function(branchID, cb) {
	var branch = {};

	augur.getPeriodLength(branchID, periodLength => {
		if (!periodLength || periodLength.error) {
			console.info("ERROR getPeriodLength", periodLength);
			return cb(periodLength);
		}
		branch.periodLength = periodLength;
		finish();
	});

	augur.getDescription(branchID, description => {
		if (!description || description.error) {
			console.info("ERROR getDescription", description);
			return cb(description);
		}
		branch.description = description;
		finish();
	});

	function finish() {
		if (branch.periodLength && branch.description) {
			cb(null, branch);
		}
	}
};

ex.loadLoginAccount = function(isHosted, cb) {

	// if available, use the client-side account
	if (augur.web.account.address && augur.web.account.privateKey) {
		console.log("using client-side account:", augur.web.account.address);
		return cb(null, {
			...augur.web.account,
			id: augur.web.account.address
		});
	}

	// hosted node: no unlocked account available
	if (isHosted) {

		// if the user has a persistent login, use it
		var account = augur.web.persist();
		if (account && account.privateKey) {
			console.log("using persistent login:", account);
			return cb(null, {
				...augur.web.account,
				id: augur.web.account.address
			});
		}
		return cb(null);
	}

	// local node: if it's unlocked, use the coinbase account
	// check to make sure the account is unlocked
	augur.rpc.unlocked(augur.from, (unlocked) => {

		// use from/coinbase if unlocked
		if (unlocked && !unlocked.error) {
			console.log("using unlocked account:", augur.from);
			return cb(null, {
				id: augur.from
			});
		}

		// otherwise, no account available
		console.log("account is locked: ", augur.from);
		return cb(null);
	});
};

ex.loadAssets = function(branchID, accountID, cbEther, cbRep, cbRealEther) {
	augur.getCashBalance(accountID, function (result) {
		if (!result || result.error) {
			return cbEther(result);
		}
		return cbEther(null, abi.bignum(result).toNumber());
	});

	augur.getRepBalance(branchID, accountID, function (result) {
		if (!result || result.error) {
			return cbRep(result);
		}
		return cbRep(null, abi.bignum(result).toNumber());
	});

	augur.rpc.balance(accountID, function (wei) {
		if (!wei || wei.error) {
			return cbRealEther(wei);
		}
		return cbRealEther(null, abi.bignum(wei).dividedBy(new BigNumber(10).toPower(18)).toNumber());
	});
};

ex.loadNumMarkets = function(branchID, cb) {
	augur.getNumMarketsBranch(branchID, numMarkets => {
		cb(null, parseInt(numMarkets, 10));
	});
};

ex.loadMarkets = function(branchID, chunkSize, totalMarkets, isDesc, chunkCB) {
	var firstStartIndex = isDesc ? totalMarkets - chunkSize + 1 : 0;

	getMarketsInfo(branchID, firstStartIndex, chunkSize, totalMarkets, isDesc);

	function getMarketsInfo(branchID, startIndex, chunkSize, totalMarkets, isDesc) {
		augur.getMarketsInfo({ branch: branchID, offset: startIndex, numMarketsToLoad: chunkSize }, marketsData => {
			var now = 0 - (Date.now() + window.performance.now());

			if (!marketsData || marketsData.error) {
				return chunkCB(marketsData);
			}

			Object.keys(marketsData).forEach((key, i) => marketsData[key].creationSortOrder = now + i);

			chunkCB(null, marketsData);

			if (isDesc && startIndex > 0) {
				setTimeout(() => getMarketsInfo(branchID, startIndex - chunkSize, chunkSize, totalMarkets, isDesc), TIMEOUT_MILLIS);
			}
			else if (!isDesc && startIndex < totalMarkets) {
				setTimeout(() => getMarketsInfo(branchID, startIndex + chunkSize, chunkSize, totalMarkets, isDesc), TIMEOUT_MILLIS);
			}
		});
	}
};

ex.loadMarket = function(marketID, cb) {
	augur.getMarketInfo(marketID, marketInfo => {
		if (marketInfo && marketInfo.error) {
			return cb(marketInfo);
		}

		cb(null, { ...marketInfo || {}, creationSortOrder: Date.now() + window.performance.now() });
	});
};

ex.listenToUpdates = function(cbBlock, cbContracts, cbPrice, cbCreation) {
	augur.filters.listen({

		// listen for new blocks
		block: function(blockHash) {
			cbBlock(null, blockHash);
		},

		// listen for augur transactions
		contracts: function(filtrate) {
			cbContracts(null, filtrate);
		},

		// update market when a price change has been detected
		price: function(result) {
			cbPrice(null, result);
		},

		// listen for new markets
		creation: function(result) {
			cbCreation(null, result);
		}

	}, function(filters) {
		console.log('### listen to filters:', filters);
	});
};

ex.loadAccountTrades = function(accountID, cb) {
	augur.getAccountTrades(accountID, null, function(accountTrades) {
		if (!accountTrades) {
			return cb();
		}
		if (accountTrades.error) {
			return cb(accountTrades);
		}
		return cb(null, accountTrades);
	});
};

ex.listenToBidsAsks = function() {

};

ex.login = function(handle, password, persist, cb) {
	augur.web.login(handle, password, { persist: persist }, (account) => {
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

ex.logout = function() {
	augur.web.logout();
};

ex.register = function(handle, password, persist, cb, cbExtras) {
	augur.web.register(handle, password, { persist: persist }, {
		onRegistered: account => {
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
		},
		onSendEther: res => {
			if (res.error) {
				return cb({ code: res.error, message: res.message });
			}
			cbExtras(res);
		},
		onSent: res => {
			if (res.error) {
				return cb({ code: res.error, message: res.message });
			}
			cbExtras(res);
		},
		onSuccess: res => {
			if (res.error) {
				return cb({ code: res.error, message: res.message });
			}
			cbExtras(res);
		},
		onFailed: err => {
			cb(err);
		}
	});
};

ex.loadMeanTradePrices = function(accountID, cb) {
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

ex.tradeShares = function(branchID, marketID, outcomeID, numShares, limit, cap, cb) {
	augur.trade({
		branch: branchID,
		market: abi.hex(marketID),
		outcome: outcomeID,
		amount: numShares,
		limit: limit,
		stop: false,
		cap: null,
		expiration: 0,
		callbacks: {
			onMarketHash: (marketHash) => cb(null, { status: 'sending...', data: marketHash }),
			onCommitTradeSent: (res) => cb(null, { status: 'committing...', data: res }),
			onCommitTradeSuccess: (res) => cb(null, { status: 'broadcasting...', data: res }),
			onCommitTradeFailed: (err) => cb(err),
			onTradeSent: (res) => cb(null, { status: 'confirming...', data: res }),
			onTradeSuccess: (res) => cb(null, { status: SUCCESS, data: res}),
			onTradeFailed: (err) => cb(err),
			onOrderCreated: (res) => console.log('onOrderCreated', res)
		}
	});
};

ex.getSimulatedBuy = function(marketID, outcomeID, numShares) {
	return augur.getSimulatedBuy(marketID, outcomeID, numShares);
};

ex.loadPriceHistory = function(marketID, cb) {
	if (!marketID) {
		cb('ERROR: loadPriceHistory() marketID required');
	}
	augur.getMarketPriceHistory(marketID, function(priceHistory) {
		if (priceHistory && priceHistory.error) {
			return cb(priceHistory.error);
		}
		cb(null, priceHistory);
	});
};

ex.createMarket = function(branchID, newMarket, minValue, maxValue, numOutcomes, cb) {
	augur.createSingleEventMarket({
		branchId: branchID,
		description: newMarket.description,
		expirationBlock: newMarket.endBlock,
		minValue: minValue,
		maxValue: maxValue,
		numOutcomes: numOutcomes,
		alpha: "0.0079",
		initialLiquidity: newMarket.initialLiquidity,
		tradingFee: newMarket.tradingFee,
		onSent: r => cb(null, { status: CREATING_MARKET, marketID: r.callReturn, txHash: r.txHash }),
		onSuccess: r => cb(null, { status: SUCCESS, marketID: r.callReturn, tx: r }),
		onFailed: r => cb(r)
	});
};

ex.createMarketMetadata = function(newMarket, cb) {
console.log('--createMarketMetadata', newMarket.id, ' --- ', newMarket.detailsText, ' --- ', newMarket.tags, ' --- ', newMarket.resources, ' --- ', newMarket.expirySource);
	augur.ramble.addMetadata({
			marketId: newMarket.id,
			details: newMarket.detailsText,
			tags: newMarket.tags,
			links: newMarket.resources,
			source: newMarket.expirySource,
			broadcast: true
		},
		res => cb(null, { status: 'processing metadata...', metadata: res }),
		res => cb(null, { status: SUCCESS, metadata: res }),
		err => cb(err)
	);
};

ex.loadMarketMetadata = function(marketID, cb) {
	augur.ramble.getMarketMetadata(marketID, {sourceless: false}, cb);
};

ex.loadRecentlyExpiredEventIDs = function(branchID, reportPeriod, cbChunk) {

	// load events that expired last reporting period
	augur.getEvents(branchID, reportPeriod.toString(), eventIDs => {

		if (!eventIDs || !eventIDs.length) {
			return cbChunk(null, {});
		}

		if (eventIDs.error) {
			return cbChunk(eventIDs);
		}

		// load event info sequentially for each event-id
		(function processEventID() {
			var eventID = eventIDs.pop(),
				numFinished = 0,
				events = {};

			events[eventID] = {};

			augur.getEventInfo(eventID, eventInfo => {
				if (eventInfo.error) {
					console.log('ERROR getEventInfo', eventInfo); // continue processing even tho we have an error
				}

				eventInfo = eventInfo || {};

				events[eventID].minValue = parseFloat(eventInfo[3]);
				events[eventID].maxValue = parseFloat(eventInfo[4]);
				events[eventID].numOutcomes = parseFloat(eventInfo[5]);

				finish();
			});

			augur.getEventIndex(reportPeriod, eventID, function (eventIndex) {
				if (eventIndex.error) {
					console.log('ERROR getEventIndex', eventIndex); // continue processing even tho we have an error
					return finish();
				}

				events[eventID].index = parseInt(eventIndex, 10);

				finish();
			});

			augur.getMarkets(eventID, eventMarketIDs => {
				events[eventID].marketID = (eventMarketIDs || [])[0];
				finish();
			});

			function finish() {
				if (++numFinished < 3) {
					return;
				}

				// if there are more event ids, queue next one
				if (eventIDs.length) {
					setTimeout(processEventID, TIMEOUT_MILLIS);
				}

				return cbChunk(null, events);
			}
		})();
	});
};

/*
ex.loadRecentlyExpiredMarketIDs = function(eventIDs, cb) {
	var marketIDs = {};

	if (!eventIDs || !eventIDs.length) {
		return cb(null, {});
	}

	// load market-ids related to each event-id one at a time
	(function processEventID() {
		var eventID = eventIDs.pop();
		augur.getMarkets(eventID, eventMarketIDs => {
			(eventMarketIDs || []).forEach(eventMarketID => marketIDs[eventMarketID] = eventID);

			// if there are more event ids, re-run this function to get their market ids
			if (eventIDs.length) {
				setTimeout(processEventID, TIMEOUT_MILLIS);
			}

			// if no more event ids to process, exit this loop and callback
			else {
				cb(null, marketIDs);
			}
		});
	})();
};
*/
ex.getReport = function(branchID, reportPeriod, eventID) {
	augur.getReport(branchID, reportPeriod, eventID, function (report) {
		console.log('*************report', report);
	});
};

ex.loadPendingReportEventIDs = function(eventIDs, accountID, reportPeriod, branchID, cb) {
	var pendingReportEventIDs = {};

	if (!eventIDs || !eventIDs.length) {
		return cb(null, {});
	}

	// load market-ids related to each event-id one at a time
	(function processEventID() {
		var eventID = eventIDs.pop(),
			randomNumber = abi.hex(abi.bignum(accountID).plus(abi.bignum(eventID))),
			diceroll = augur.rpc.sha3(randomNumber, true);

		if (!diceroll) {
			console.log('WARN: couldn\'t get sha3 for', randomNumber, diceroll);
			return finish();
		}

		augur.calculateReportingThreshold(branchID, eventID, reportPeriod, threshold => {
			if (!threshold) {
				console.log('WARN: couldn\'t get reporting threshold for', eventID);
				return finish();
			}
			if (threshold.error) {
				console.log('ERROR: calculateReportingThreshold', threshold);
				return finish();
			}
			if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
				augur.getReportHash(branchID, reportPeriod, accountID, eventID, function (reportHash) {
					if (reportHash && reportHash !== '0x0') {
						pendingReportEventIDs[eventID] = { reportHash };
					}
					else {
						pendingReportEventIDs[eventID] = { reportHash: null };
					}

					finish();
				});
			}
			else {
				finish();
			}
		});

		function finish() {

			// if there are more event ids, re-run this function to get their market ids
			if (eventIDs.length) {
				setTimeout(processEventID, TIMEOUT_MILLIS);
			}

			// if no more event ids to process, exit this loop and callback
			else {
				cb(null, pendingReportEventIDs);
			}
		}
	})();
};

ex.submitReportHash = function(branchID, accountID, event, report, cb) {
	var minValue = abi.bignum(event.minValue),
		maxValue = abi.bignum(event.maxValue),
		numOutcomes = abi.bignum(event.numOutcomes),
		reportHash,
		rescaledReportedOutcome;

	// Re-scale scalar/categorical reports so they fall between 0 and 1
	if (report.isIndeterminate) {
		rescaledReportedOutcome = report.reportedOutcomeID;
	}
	else {
		if (report.isScalar) {
			rescaledReportedOutcome = abi.bignum(report.reportedOutcomeID).minus(minValue).dividedBy(maxValue.minus(minValue)).toFixed();
		}
		else if (report.isCategorical) {
			rescaledReportedOutcome = abi.bignum(report.reportedOutcomeID).minus(abi.bignum(1)).dividedBy(numOutcomes.minus(abi.bignum(1))).toFixed();
		}
		else {
			rescaledReportedOutcome = report.reportedOutcomeID;
		}
	}

	reportHash = augur.makeHash(report.salt, rescaledReportedOutcome, event.id, accountID, report.isIndeterminate, report.isScalar);

	augur.submitReportHash({
		branch: branchID,
		reportHash: reportHash,
		reportPeriod: report.reportPeriod,
		eventID: event.id,
		eventIndex: event.index,
		onSent: res => cb(null, { ...res, reportHash, status: 'processing...' }),
		onSuccess: res => cb(null, { ...res, reportHash, status: SUCCESS }),
		onFailed: err => cb(err)
	});
};

module.exports = ex;