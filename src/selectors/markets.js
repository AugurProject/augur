import { makeNumber } from '../utils/make-number';

import { M } from '../modules/site/constants/pages';
import { CREATE_MARKET, BUY_SHARES, SELL_SHARES, BID_SHARES, ASK_SHARES, SUBMIT_REPORT } from '../modules/transactions/constants/types';

module.exports = makeMarkets();

function makeMarkets(numMarkets = 20) {
	var markets = [],
		types = ['binary', 'categorical', 'scalar'],
		i;

	for (i = 0; i < numMarkets; i++) {
		markets.push(makeDummyMarket(i));
	}

	return markets;

	function makeDummyMarket(index) {
		var id = index.toString(),
			m = {
				id: id,
				type: types[randomInt(0, types.length - 1)],
				description: 'Will the dwerps achieve a mwerp by the end of zwerp ' + (index + 1) + '?',
				endDate: { formatted: '12/12/2017' },
				tradingFeePercent: makeNumber(randomInt(1, 10), '%', true),
				volume: makeNumber(randomInt(0, 10000), 'Shares', true),
				isOpen: Math.random() > 0.1,
				isPendingReport: Math.random() < 0.5,
				marketLink: { text: 'Trade', className: 'trade', onClick: () => require('../selectors').update({ activePage: M, market: m }) },
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
						require('../selectors').update();
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
						require('../selectors').update();
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
						require('../selectors').update();
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