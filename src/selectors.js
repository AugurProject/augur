import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from './modules/auth/constants/auth-types';
import { CREATE_MARKET, BUY_SHARES, SELL_SHARES, BID_SHARES, ASK_SHARES, SUBMIT_REPORT } from './modules/transactions/constants/types';

var selectors = {};

selectors.activePage = MARKETS;

selectors.loginAccount = {
	id: '123',
	handle: 'Johnny',
	rep: emptyNumber('rep'),
	ether: emptyNumber('eth'),
	realEther: emptyNumber('eth')
};

selectors.links = {
	authLink: { href: '', onClick: () => module.exports.update({ activePage: LOGIN }) },
	marketsLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	positionsLink: { href: '', onClick: () => module.exports.update({ activePage: POSITIONS }) },
	transactionsLink: { href: '', onClick: () => module.exports.update({ activePage: TRANSACTIONS }) },
	marketLink: { href: '', onClick: () => module.exports.update({ activePage: M }) },
	previousLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	createMarketLink: { href: '', onClick: () => module.exports.update({ activePage: MAKE }) }
};

selectors.keywords = {
	value: '',
	onChangeKeywords: () => {}
};

selectors.authForm = {};

selectors.transactions =  [];
selectors.transactionsTotals =  {
	title: '0 Transactions'
};
selectors.isTransactionsWorking =  false;


selectors.searchSort = {
	selectedSort: { prop: 'creationDate', isDesc: true },
	sortOptions: [{ label: 'Creation Date', value: 'creationDate' }, { label: 'End Date', value: 'endDate' }, { label: 'Description', value: 'description' }]
};

selectors.marketsHeader =  {};
selectors.markets = makeMarkets();
selectors.market =  {}; // selected market
selectors.marketsTotals = {
	positionsSummary: {
		numPositions: makeNumber(3, 'Positions', true),
		totalValue: makeNumber(985, 'eth'),
		gainPercent: makeNumber(15, '%')
	},
	numPendingReports: 19
};

selectors.filtersProps =  {};
selectors.onChangeSort = (prop, isDesc) => {
	if (isDesc !== false && isDesc !== true) {
		isDesc = selectors.searchSort.selectedSort.isDesc;
	}
	module.exports.update({
		searchSort: {
			...selectors.searchSort,
			selectedSort: {
				prop: prop || selectors.selectedSort.prop,
				isDesc
			}
		}
	});
};

selectors.pagination = {
	numPerPage: 10,
	numPages: 10,
	selectedPageNum: 1,
	nextPageNum: 2,
	startItemNum: 1,
	endItemNum: 10,
	numUnpaginated: 89,
	nextItemNum: 11,
	onUpdateSelectedPageNum: (selectedPageNum) => module.exports.update({
		pagination: {
			...selectors.pagination,
			selectedPageNum,
			nextPageNum: selectedPageNum + 1,
			previousPageNum: selectedPageNum - 1,
			startItemNum: ((selectedPageNum - 1) * 10) + 1,
			endItemNum: selectedPageNum * 10,
			nextItemNum: selectedPageNum * 10 + 1,
			previousItemNum: ((selectedPageNum - 2) * 10) + 1
		}
	})
};

selectors.createMarketForm =  {};



selectors.update = function(newState) {
	console.log('*** update', newState);
	Object.keys(newState).forEach(key => selectors[key] = newState[key]);
	selectors.render();
};

module.exports = selectors;

function makeNumber(num, denomination, omitSign) {
	var o = {
		value: num,

		formattedValue: num,
		formatted: num.toString(),

		roundedValue: num,
		rounded: num.toString(),

		minimized: num.toString(),
		denomination: denomination || ''
	};

	if (!omitSign) {
        if (o.value > 0) {
            o.formatted = '+' + o.formatted;
            o.rounded = '+' + o.rounded;
            o.minimized = '+' + o.minimized;
        }
	}

	o.full = o.formatted + o.denomination;

	return o;
}

function emptyNumber(denomination) {
	return {
		value: 0,
		formattedValue: 0,
		formatted: '-',
		rounded: '-',
		minimized: '-',
		full: '-',
		denomination: denomination || ''
	};
}

function makeMarkets(numMarkets = 20) {
	var markets = [],
		types = ['binary', 'categorical', 'scalar'],
		i;

	for (i = 0; i < numMarkets; i++) {
		markets.push(makeDummyMarket(i));
	}

	return markets;

	function makeDummyMarket(index) {
		let dayMillis = 24 * 60 * 60 * 1000;
		let nowMillis = new Date().getTime();

		var id = index.toString(),
			m = {
				id: id,
				type: types[randomInt(0, types.length - 1)],
				description: 'Will the dwerps achieve a mwerp by the end of zwerp ' + (index + 1) + '?',
				endDate: { formatted: '12/12/2017' },
				tradingFeePercent: makeNumber(randomInt(1, 10), '%', true),
				volume: makeNumber(randomInt(0, 10000), 'Shares', true),
				priceTimeSeries: [{
					name: "outcome 1",
					data: [
						[nowMillis - 50 * dayMillis, 0.3],
						[nowMillis - 40 * dayMillis, 0.1],
						[nowMillis - 30 * dayMillis, 0.65],
						[nowMillis - 20 * dayMillis, 0.93]
					],
					color: "#f00"
				},
					{
						name: "outcome 2",
						data: [
							[nowMillis - 55 * dayMillis, 0.8],
							[nowMillis - 45 * dayMillis, 0.7],
							[nowMillis - 35 * dayMillis, 0.6],
							[nowMillis - 25 * dayMillis, 0.4]
						],
						color: "#0f0"
					}],
				isOpen: Math.random() > 0.1,
				isPendingReport: Math.random() < 0.5,
				marketLink: { text: 'Trade', className: 'trade', onClick: () => module.exports.update({ activePage: M, market: m }) },
			};

		m.outcomes = [
			{
				id: '1',
				name: 'YES',
				lastPrice: makeNumber(Math.round(Math.random() * 100) / 100, 'eth'),
				lastPricePercent: makeNumber(randomInt(50, 100), '%'),
				position: {
					qtyShares: makeNumber(16898, 'Shares'),
					totalValue: makeNumber(14877, 'eth'),
					gainPercent: makeNumber(14, '%'),
					purchasePrice: makeNumber(0.77, 'eth'),
					shareChange: makeNumber(0.107, 'eth'),
					totalCost: makeNumber(12555, 'eth'),
					netChange: makeNumber(3344, 'eth')
				},
				trade: {
					numShares: 0,
					limitPrice: 0,
					tradeSummary: {
						totalEther: makeNumber(0)
					},
					onChangeTrade: (numShares, limitPrice) => {
						limitPrice = m.outcomes[0].lastPrice.value;
						m.outcomes[0].trade.numShares = numShares;
						m.outcomes[0].trade.limitPrice = limitPrice;
						m.outcomes[0].trade.totalCost = makeNumber(Math.round(numShares * limitPrice * -100) / 100);
						console.log(m.outcomes[0].trade);
						selectors.render();
					}
				}
			},
			{
				id: '2',
				name: 'NO',
				lastPrice: makeNumber(Math.round(Math.random() * 100) / 100, 'eth'),
				lastPricePercent: makeNumber(randomInt(20, 50), '%'),
				position: {
					qtyShares: makeNumber(455, 'Shares'),
					totalValue: makeNumber(776, 'eth'),
					gainPercent: makeNumber(-6, '%'),
					purchasePrice: makeNumber(0.6, 'eth'),
					shareChange: makeNumber(0.5, 'eth'),
					totalCost: makeNumber(980, 'eth'),
					netChange: makeNumber(230, 'eth')
				},
				trade: {
					numShares: 0,
					limitPrice: 0,
					tradeSummary: {
						totalEther: makeNumber(0)
					},
					onChangeTrade: (numShares, limitPrice) => {
						limitPrice = m.outcomes[0].lastPrice.value;
						m.outcomes[1].trade.numShares = numShares;
						m.outcomes[1].trade.limitPrice = limitPrice;
						m.outcomes[1].trade.totalCost = makeNumber(Math.round(numShares * limitPrice * -100) / 100);
						selectors.render();
					}
				}
			},
			{
				id: '3',
				name: 'MAYBE',
				lastPrice: makeNumber(Math.round(Math.random() * 100) / 100, 'eth'),
				lastPricePercent: makeNumber(randomInt(0, 30), '%'),
				trade: {
					numShares: 0,
					limitPrice: 0,
					tradeSummary: {
						totalEther: makeNumber(0)
					},
					onChangeTrade: (numShares, limitPrice) => {
						limitPrice = m.outcomes[0].lastPrice.value;
						m.outcomes[2].trade.numShares = numShares;
						m.outcomes[2].trade.limitPrice = limitPrice;
						m.outcomes[2].trade.totalCost = makeNumber(Math.round(numShares * limitPrice * -100) / 100);
						selectors.render();
					}
				}
			}
		];

		m.reportableOutcomes = m.outcomes.slice();
		m.reportableOutcomes.push({ id: '1.5', name: 'indeterminate' });

		// trade summary
		Object.defineProperty(m, 'tradeSummary', {
			get: () => {
				var tots = m.outcomes.reduce((p, outcome) => {
						var numShares,
							limitPrice,
							cost;

						if (!outcome.trade || !outcome.trade.numShares) {
							return p;
						}

						numShares = outcome.trade.numShares;
						limitPrice = outcome.trade.limitPrice || 0;
						cost = numShares * limitPrice;

						p.tradeOrders.push({ type: BUY_SHARES, shares: makeNumber(numShares), ether: makeNumber(cost), data: { outcomeName: 'MAYBE', marketDescription: m.description } });
						p.totalShares += numShares;
						p.totalEther += cost;
						return p;
					}, { totalShares: 0, totalEther: 0, totalFees: 0, totalGas: 0, tradeOrders: [] });

				tots.totalShares = makeNumber(tots.totalShares);
				tots.totalEther = makeNumber(tots.totalEther);
				tots.totalFees = makeNumber(tots.totalFees);
				tots.totalGas = makeNumber(tots.totalGas);
				tots.onSubmitPlaceTrade = () => {};

				return tots;
			},
			enumerable: true
		});

		// positions summary
		m.positionsSummary = {
			numPositions: makeNumber(3, 'Positions', true),
			totalValue: makeNumber(985, 'eth'),
			gainPercent: makeNumber(15, '%')
		};

		// report
		m.report = {
			isUnethical: true,
			onSubmitReport: (reportedOutcomeID, isUnethical) => {}
		};

		return m;
	}
}


function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}