import { makeNumber } from '../utils/make-number';
import selectOrderBook from '../selectors/bids-asks/select-bids-asks';

import { M } from '../modules/site/constants/pages';
import { BUY } from '../modules/trade/constants/types';

module.exports = makeMarkets();

function makeMarkets(numMarkets = 50) {
	const markets = [];
	const types = ['binary', 'categorical', 'scalar'];

	for (let i = 0; i < numMarkets; i++) {
		setTimeout(() => {
			markets.push(makeMarket(i));
			require('../selectors').update({ markets });
		}, i * 500);
	}

	return markets;

	function makeMarket(index) {
		const id = index.toString();
		const d = new Date('2017/12/12/');
		const m = {
			id,
			type: types[randomInt(0, types.length - 1)],
			description: `Will the dwerps achieve a mwerp by the end of zwerp ${(index + 1)}?`,
			endDate: {
				value: d,
				formatted: `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`,
				full: d.toISOString()
			},
			endDateLabel: (d < new Date()) ? 'ended' : 'ends',
			takerFeePercent: makeNumber(randomInt(1, 10), '%', true),
			makerFeePercent: makeNumber(randomInt(1, 5), '%', true),
			volume: makeNumber(randomInt(0, 10000), 'shares', true),
			isOpen: randomInt(0, 100) > 5,
			isPendingReport: index > 0 && index % 4 === 0,
			marketLink: {
				text: 'Trade',
				className: 'trade',
				onClick: () => require('../selectors').update({ activePage: M, market: m, url: `/m/${id}` })
			},
			orderBook: {}
		};

		// tags
		m.tags = makeTags();

		// outcomes
		m.outcomes = makeOutcomes();

		// reportable outcomes
		m.reportableOutcomes = m.outcomes.slice();
		m.reportableOutcomes.push({ id: '1.5', name: 'indeterminate' });

		m.onSubmitPlaceTrade = () => {}; // No action in dummy selector

		// trade summary
		m.tradeSummary = {
			totalShares: makeNumber(0, 'shares'),
			totalEther: makeNumber(0, 'eth'),
			totalGas: makeNumber(0, 'eth'),
			feeToPay: makeNumber(0, 'eth'),
			tradeOrders: []
		};

		// price history
		const dayMillis = 24 * 60 * 60 * 1000;
		const nowMillis = new Date().getTime();
		m.priceTimeSeries = [
			{
				name: 'outcome 1',
				data: [
					[nowMillis - 50 * dayMillis, 0.3],
					[nowMillis - 40 * dayMillis, 0.1],
					[nowMillis - 30 * dayMillis, 0.65],
					[nowMillis - 20 * dayMillis, 0.93]
				],
				color: '#f00'
			},
			{
				name: 'outcome 2',
				data: [
					[nowMillis - 55 * dayMillis, 0.8],
					[nowMillis - 45 * dayMillis, 0.7],
					[nowMillis - 35 * dayMillis, 0.6],
					[nowMillis - 25 * dayMillis, 0.4]
				],
				color: '#0f0'
			}
		];

		// positions summary
		m.positionsSummary = {
			numPositions: makeNumber(3, 'Positions', true),
			qtyShares: makeNumber(10, 'shares'),
			purchasePrice: makeNumber(0.5, 'eth'),
			totalCost: makeNumber(5, 'eth'),
			shareChange: makeNumber(1, 'shares'),
			netChange: makeNumber(1, 'eth'),
			totalValue: makeNumber(985, 'eth'),
			gainPercent: makeNumber(15, '%')
		};

		// report
		m.report = {
			isUnethical: true,
			onSubmitReport: (reportedOutcomeID, isUnethical) => {
			}
		};
		function makeTags() {
			const randomNum = randomInt(1, 100);
			const allTags = {
				Politics: {
					USA: {
						Presedential: true,
						'State Politics': true
					},

					Canada: {
						'Prime Minister': true,
						Quebec: true
					}
				},

				Sports: {
					'Football (American)': {
						'2016 Season': true,
						Superbowl: true
					},
					'Football/Soccer (European)': {
						'World Cup': true,
						Manchester: true,
						'Euro 2016': true
					},
					Tennis: {
						Wimbledon: true,
						'US Open': true,
						Women: true
					}
				},

				Finance: {
					Equities: {
						Tech: true,
						Google: true
					},
					Commodities: {
						Oil: true,
						'Crude Oil': true,
						Corn: true
					},
					'Real-Estate': {
						London: true,
						Global: true
					}
				}
			};
			let currentTier = allTags;
			const finalTags = [];
			let numTags;

			// randomly choose num tags with more weight towards having all 3
			if (randomNum >= 95) {
				numTags = 0;
			} else if (randomNum >= 85) {
				numTags = 1;
			} else if (randomNum >= 65) {
				numTags = 2;
			} else {
				numTags = 3;
			}

			for (let i = 0; i < numTags; i++) {
				const keysCurrentTier = Object.keys(currentTier);
				const randomTag = keysCurrentTier[randomInt(0, keysCurrentTier.length - 1)];
				finalTags.push({
					name: randomTag,
					onClick: () => console.log('on clickity')
				});
				currentTier = currentTier[randomTag];
			}

			return finalTags;
		}

		function makeOutcomes() {
			const numOutcomes = randomInt(2, 8);
			const outcomes = [];
			const orderBook = selectOrderBook();

			let	outcome;
			let percentLeft = 100;

			for (let i = 0; i < numOutcomes; i++) {
				outcome = makeOutcome(i, percentLeft, orderBook);
				percentLeft = percentLeft - outcome.lastPricePercent.value;
				outcomes.push(outcome);
			}

			const finalLastPrice = (outcome.lastPricePercent.value + percentLeft) / 100;
			outcome.lastPrice = makeNumber(finalLastPrice, 'eth');
			outcome.lastPricePercent = makeNumber(finalLastPrice * 100, '%');

			return outcomes.sort((a, b) => b.lastPrice.value - a.lastPrice.value);

			function makeOutcome(index, percentLeft, orderBook) {
				const outcomeID = index.toString();
				const lastPrice = randomInt(0, percentLeft) / 100;
				const outcome = {
					id: index.toString(),
					marketID: outcomeID,
					name: makeName(index),
					lastPrice: makeNumber(lastPrice, 'eth'),
					lastPricePercent: makeNumber(lastPrice * 100, '%'),
					position: {
						qtyShares: makeNumber(16898, 'shares'),
						totalValue: makeNumber(14877, 'eth'),
						gainPercent: makeNumber(14, '%'),
						purchasePrice: makeNumber(0.77, 'eth'),
						shareChange: makeNumber(0.107, 'eth'),
						totalCost: makeNumber(12555, 'eth'),
						netChange: makeNumber(3344, 'eth')
					},
					trade: {
						side: BUY,
						numShares: 0,
						limitPrice: 0,
						tradeSummary: {},
						updateTradeOrder: (shares, limitPrice, side) => {
							console.log('update trade order:', shares, limitPrice, side);
							const outcome = {
								...m.outcomes.find((outcome) => outcome.id === outcomeID)
							};

							if (typeof shares !== 'undefined') {
								outcome.trade.numShares = shares;
							}
							if (typeof limitPrice !== 'undefined') {
								outcome.trade.limitPrice = limitPrice;
							}
							if (typeof side !== 'undefined') {
								outcome.trade.side = side;
							}

							const randLimitPrice = randomInt(1, 100) / 100;
							const totEth = outcome.trade.numShares * (outcome.trade.limitPrice || randLimitPrice);
							const totEthFinal = outcome.trade.side === BUY ? -1 * totEth : totEth;
							outcome.trade.tradeSummary.feeToPay = makeNumber(Math.round(0.02 * (outcome.trade.limitPrice || randLimitPrice) * outcome.trade.numShares * 100) / 100, 'eth');
							const feeForTotalEther = -1 * outcome.trade.tradeSummary.feeToPay.value;
							outcome.trade.tradeSummary.totalEther = makeNumber(Math.round((totEthFinal + feeForTotalEther) * 100) / 100, 'eth');

							m.outcomes = m.outcomes.map(currentOutcome => {
								if (currentOutcome.id === outcomeID) {
									return outcome;
								}
								return currentOutcome;
							});

							m.tradeSummary = m.outcomes.reduce((p, outcome) => {
								if (!outcome.trade || !outcome.trade.numShares) {
									return p;
								}

								p.totalShares += outcome.trade.side === BUY ? outcome.trade.numShares : -1 * outcome.trade.numShares;
								p.totalEther += outcome.trade.tradeSummary.totalEther.value;

								p.tradeOrders.push({
									type: outcome.trade.side,
									shares: makeNumber(outcome.trade.numShares, 'shares'),
									ether: outcome.trade.tradeSummary.totalEther,
									data: {
										outcomeName: outcome.name,
										marketDescription: m.description,
										avgPrice: makeNumber(Math.round((outcome.trade.tradeSummary.totalEther.value / outcome.trade.numShares) * 100) / 100, 'eth'),
									}
								});

								return p;
							}, { feeToPay: 0, totalShares: 0, totalEther: 0, totalFees: 0, totalGas: 0, tradeOrders: [] });

							m.tradeSummary.feeToPay = makeNumber(outcome.trade.tradeSummary.feeToPay, 'eth');
							m.tradeSummary.totalShares = makeNumber(outcome.trade.tradeSummary.totalShares, 'shares');
							m.tradeSummary.totalEther = makeNumber(outcome.trade.tradeSummary.totalEther, 'eth');
							m.tradeSummary.totalFees = makeNumber(outcome.trade.tradeSummary.totalFees);
							m.tradeSummary.totalGas = makeNumber(outcome.trade.tradeSummary.totalGas);

							require('../selectors').update({
								markets: markets.map(currentMarket => {
									if (currentMarket.id === m.id) {
										return m;
									}
									return currentMarket;
								})
							});
						}
					},
					topBid: {
						price: orderBook.bids[0].price,
						shares: orderBook.bids[0].shares
					},
					topAsk: {
						price: orderBook.asks[0].price,
						shares: orderBook.asks[0].shares
					},
					orderBook
				};

				return outcome;

				function makeName(index) {
					return ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'][index];
				}
			}
		}

		return m;
	}
}


function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
