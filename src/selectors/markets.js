import { makeNumber } from '../utils/make-number';

import { M } from '../modules/site/constants/pages';
import { CREATE_MARKET, BUY_SHARES, SELL_SHARES, BID_SHARES, ASK_SHARES, SUBMIT_REPORT } from '../modules/transactions/constants/types';

module.exports = makeMarkets();

function makeMarkets(numMarkets = 25) {
	var markets = [],
		types = ['binary', 'categorical', 'scalar'],
		i;

	for (i = 0; i < numMarkets; i++) {
		markets.push(makeMarket(i));
	}

	return markets;

	function makeMarket(index) {
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

		// tags
		m.tags = makeTags();
		function makeTags() {
			var randomNum = randomInt(1, 100),
				numTags,
				allTags = {
					'Politics': {
						'USA': {
							'Presedential': true,
							'State Politics': true
						},

						'Canada': {
							'Prime Minister': true,
							'Quebec': true
						}
					},

					'Sports': {
						'Football (American)': {
							'2016 Season': true,
							'Superbowl': true
						},
						'Football/Soccer (European)': {
							'World Cup': true,
							'Manchester': true,
							'Euro 2016': true
						},
						'Tennis': {
							'Wimbledon': true,
							'US Open': true,
							'Women': true
						}
					},

					'Finance': {
						'Equities': {
							'Tech': true,
							'Google': true
						},
						'Commodities': {
							'Oil': true,
							'Crude Oil': true,
							'Corn': true
						},
						'Real-Estate': {
							'London': true,
							'Global': true
						}
					}
				},
				currentTier = allTags,
				finalTags = [];

			// randomly choose num tags with more weight towards having all 3
			if (randomNum >= 95) {
				numTags = 0;
			}
			else if (randomNum >= 85) {
				numTags = 1;
			}
			else if (randomNum >= 65) {
				numTags = 2;
			}
			else {
				numTags = 3;
			}

			for (var i = 0; i < numTags; i++) {
				let keysCurrentTier = Object.keys(currentTier);
				let randomTag = keysCurrentTier[randomInt(0, keysCurrentTier.length - 1)];
				finalTags.push({
					name: randomTag,
					onClick: () => console.log('on clickity')
				});
				currentTier = currentTier[randomTag];
			}

			return finalTags;
		}

		// outcomes
		m.outcomes = makeOutcomes();
		function makeOutcomes() {
			var numOutcomes = randomInt(2, 8),
				outcomes = [],
				outcome,
				percentLeft = 100;

			for (var i = 1; i <= numOutcomes; i++) {
				outcome = makeOutcome(i, percentLeft);
				percentLeft = percentLeft - outcome.lastPricePercent.value;
				outcomes.push(outcome);
			}

			let finalLastPrice = (outcome.lastPricePercent.value + percentLeft) / 100;
			outcome.lastPrice= makeNumber(finalLastPrice, 'eth');
			outcome.lastPricePercent = makeNumber(finalLastPrice * 100, '%');

			return outcomes.sort((a, b) => b.lastPrice.value - a.lastPrice.value);

			function makeOutcome(index, percentLeft) {
				var lastPrice = randomInt(0, percentLeft) / 100;
				return {
					id: index.toString(),
					name: makeName(index),
					lastPrice: makeNumber(lastPrice, 'eth'),
					lastPricePercent: makeNumber(lastPrice * 100, '%'),
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
							m.outcomes[index].trade.numShares = numShares;
							m.outcomes[index].trade.limitPrice = limitPrice;
							m.outcomes[index].trade.totalCost = makeNumber(Math.round(numShares * limitPrice * -100) / 100);
							console.log(m.outcomes[index].trade);
							require('../selectors').update();
						}
					}
				};

				function makeName(index) {
					switch(index) {
						case 1: return 'One';
						case 2: return 'Two';
						case 3: return 'Three';
						case 4: return 'Four';
						case 5: return 'Five';
						case 6: return 'Six';
						case 7: return 'Seven';
						case 8: return 'Eight';
					}
				}
			}
		}

		// reportable outcomes
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

		// price history
		let dayMillis = 24 * 60 * 60 * 1000;
		let nowMillis = new Date().getTime();
		m.priceTimeSeries = [
			{
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
			}
		];

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