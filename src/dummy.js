// NOTE -- This file is no longer used.

import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../modules/transactions/constants/statuses';

var ex = {},
	numMarkets = 50;

ex.connect = function(cb) {
	console.log('augurjs-dummy connect()');
	cb();
};

ex.loadCurrentBlock = function(cb) {
	cb(1000);
};

ex.loadLoginAccount = function(isHosted, cb) {
	cb(null, {
		id: '123',
		handle: 'Johnny'
	});
};

ex.loadNumMarkets = function(branchId, cb) {
	cb(null, 100);
};

ex.loadAssets = function(branchID, accountID, cbEther, cbRep, cbRealEther) {
	setTimeout(() => cbEther(null, 10000), randomInt(1, 3) * 1000);
	setTimeout(() => cbRep(null, 50), randomInt(2, 4) * 1000);
	setTimeout(() => cbRealEther(null, 5), randomInt(3, 5) * 1000);
};

ex.loadMarkets = function(branchId, chunkSize, totalMarkets, isDesc, chunkCB) {
	var markets = {},
		types = ['binary', 'categorical', 'scalar'],
		i;

	for (i = 0; i < numMarkets; i++) {
		markets = {
			...markets,
			...makeDummyMarket(i)
		};
	}

    chunkCB(null, markets);

	function makeDummyMarket(index) {
		return {
			[index] : {
				type: types[randomInt(0, types.length - 1)],
				description: 'Will the dwerps achieve a mwerp by the end of zwerp ' + (index + 1) + '?',
				outcomes: [
					{ id: 1, name: 'YES', price: randomInt(0, 100) / 100 },
					{ id: 2, name: 'NO', price: randomInt(0, 100) / 100 },
					{ id: 3, name: 'MAYBE', price: randomInt(0, 100) / 100 }
				],
				endDate: 134543,
				tradingFee: randomInt(1, 10) / 100,
				volume: randomInt(0, 10000)
			}
		}
	}
};

ex.loadMarket = function(marketID, cb) {
	cb(null, {});
};

ex.listenToUpdates = function() {
	console.log('augurjs-dummy listenToUpdates()');
};

ex.listenToBidsAsks = function() {
	console.log('augurjs-dummy listenToBidsAsks()');
};

ex.login = function(handle, password, persist, cb) {
	cb({ id: '111', handle: 'Johnny' });
};

ex.logout = function() {
	console.log('augurjs-dummy logout()');
};

ex.register = function(handle, password, persist, cb, cbExtras) {
	setTimeout(() => {
		cb(null, {
			id: '123',
			handle: handle
		});

		setTimeout(() => cbExtras({ ether: 5 }), randomInt(2, 5) * 1000);
		setTimeout(() => cbExtras({ cash: 10000 }), randomInt(5, 10) * 1000);
		setTimeout(() => cbExtras({ rep: 50 }), randomInt(10, 15) * 1000);
	}, randomInt(0, 3) * 1000);
};

ex.loadMeanTradePrices = function(accountID, cb) {
	console.log('augurjs-dummy loadMeanTradePrices()');
};

ex.createMarket = function(branchId, newMarket, minValue, maxValue, numOutcomes, cb) {
	setTimeout(() => cb(null, { status: SUCCESS, marketID: '123', tx: {} }), randomInt(5, 10) * 1000);
};

ex.createMarketMetadata = function(newMarket, cb) {
	cb(null, { status: SUCCESS, metadata: {} });
};

ex.loadAccountTrades = function(accountID) {
};

ex.tradeShares = function(branchID, marketID, outcomeID, numShares, limit, cap, cb) {
	setTimeout(() => cb(null, { status: 'sending...' }), randomInt(0, 5) * 1000);
	setTimeout(() => cb(null, { status: 'committing...' }), randomInt(5, 10) * 1000);
	setTimeout(() => cb(null, { status: 'broadcasting...' }), randomInt(10, 15) * 1000);
	setTimeout(() => cb(null, { status: 'confirming...' }), randomInt(15, 20) * 1000);
	setTimeout(() => cb(null, { status: 'finalizing...' }), randomInt(20, 25) * 1000);
	setTimeout(() => cb(null, { status: SUCCESS }), randomInt(25, 30) * 1000);
};

ex.loadPriceHistory = function(marketID, cb) {
	console.log('augurjs-dummy loadPriceHistory()');
};

/* using loadAccountTrades instead
ex.loadPositions = function(accountID, cb) {
	var numPositions = randomInt(0, numMarkets - 1);

    for (var i = 0; i < numPositions; i++) {
    	cb(null, makePosition(randomInt(0, numMarkets - 1), randomInt(0, 2)));
    }

	return;

    function makePosition(marketID, outcomeID) {
        return {
        	marketID,
        	outcomeID,
            [marketID]: {
                [outcomeID]: {
                    qtyShares: randomInt(10, 1000),
                    purchasePrice: Math.random()
                }
            }
        };
    }
};
*/
ex.loadPendingReports = function(accountID, cb) {
	var numReports = randomInt(0, numMarkets - 20),
		reports = {};

    for (var i = 0; i < numReports; i++) {
    	reports[randomInt(0, numMarkets - 1)] = true;
    }

	return cb(null, reports);
};


function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = ex;