import { makeNumber } from '../utils/make-number';
import { makeDate } from '../utils/make-date';
import selectOrderBook from '../selectors/bids-asks/select-bids-asks';

import { BINARY, CATEGORICAL, SCALAR } from '../modules/markets/constants/market-types';

import { M } from '../modules/site/constants/pages';

module.exports = makeMarkets();

function makeMarkets(numMarkets = 10) {
	const markets = [];
	const types = [BINARY, CATEGORICAL, SCALAR];

	for (let i = 0; i < 5; i++) {
		markets.push(makeMarket(i));
	}

	for (let i = 5; i < numMarkets; i++) {
		setTimeout(() => {
			markets.push(makeMarket(i));
			require('../selectors').update({ markets });
		}, (i - 4) * 500);
	}

	return markets;

	function makeMarket(index) {
		const id = index.toString();
		const d = new Date('2017/12/12/');
		const m = {
			id,
			author: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
			resolution: index % 3 === 0 ? 'generic' : 'https://www.augur.net',
			extraInfo: 'some extraInfo for this market',
			type: types[randomInt(0, types.length - 1)],
			description: `Will the dwerps achieve a mwerp by the end of zwerp ${(index + 1)}?`,
			endDate: makeDate(d),
			creationTime: makeDate(new Date(14706977556)),
			outstandingShares: makeNumber(1000),
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
			}
		};

		// tags
		m.tags = makeTags();

		// outcomes
		m.outcomes = makeOutcomes(index);

		// reportable outcomes
		m.reportableOutcomes = m.outcomes.slice();
		m.reportableOutcomes.push({ id: '1.5', name: 'indeterminate' });

		m.onSubmitPlaceTrade = () => {}; // No action in dummy selector

		// trade summary
		m.tradeSummary = {
			totalGas: makeNumber(0, ' ETH'),
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
		m.myPositionsSummary = {
			numPositions: makeNumber(2, 'Positions', true),
			qtyShares: makeNumber(16898, 'shares'),
			purchasePrice: makeNumber(0.5, ' ETH'),
			totalCost: makeNumber(5, ' ETH'),
			shareChange: makeNumber(1, 'shares'),
			netChange: makeNumber(1, ' ETH'),
			totalValue: makeNumber(985, ' ETH'),
			gainPercent: makeNumber(14, '%')
		};

		// position-outcomes
		const randomPositionOutcome = m.outcomes[randomInt(0, m.outcomes.length - 1)];
		randomPositionOutcome.position = {
			qtyShares: makeNumber(16898, 'shares'),
			totalValue: makeNumber(14877, ' ETH'),
			gainPercent: makeNumber(14, '%'),
			purchasePrice: makeNumber(0.77, ' ETH'),
			shareChange: makeNumber(0.107, ' ETH'),
			totalCost: makeNumber(12555, ' ETH'),
			netChange: makeNumber(3344, ' ETH')
		};
		const randomPositionOutcome2 = m.outcomes[randomInt(0, m.outcomes.length - 1)];
		randomPositionOutcome2.position = {
			qtyShares: makeNumber(16898, 'shares'),
			totalValue: makeNumber(14877, ' ETH'),
			gainPercent: makeNumber(14, '%'),
			purchasePrice: makeNumber(0.77, ' ETH'),
			shareChange: makeNumber(0.107, ' ETH'),
			totalCost: makeNumber(12555, ' ETH'),
			netChange: makeNumber(3344, ' ETH')
		};
		m.myPositionOutcomes = [randomPositionOutcome, randomPositionOutcome2];

		m.userOpenOrdersSummary = {
			openOrdersCount: makeNumber(m.outcomes.reduce((openOrdersCount, outcome) => (
				openOrdersCount + outcome.userOpenOrders.length
			), 0), 'Open Orders')
		};

		// market summary
		m.myMarketSummary = {
			endDate: makeDate(new Date('2017/12/12')),
			fees: makeNumber(Math.random() * 10, ' ETH'),
			volume: makeNumber(Math.floor(Math.random() * 100), null, true),
			numberOfTrades: makeNumber(Math.floor(Math.random() * 1000), null, true),
			averageTradeSize: makeNumber(Math.random() * 100, ' ETH', true),
			openVolume: makeNumber(Math.floor(Math.random() * 10000), null, true)
		};

		// report
		m.report = {
			isIndeterminate: false,
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

		function makeOutcomes(marketIndex) {
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
			outcome.lastPrice = makeNumber(finalLastPrice, ' ETH');
			outcome.lastPricePercent = makeNumber(finalLastPrice * 100, '%');

			return outcomes.sort((a, b) => b.lastPrice.value - a.lastPrice.value);

			function makeOutcome(index, percentLeft, orderBook) {
				const outcomeID = index.toString();
				const lastPrice = randomInt(0, percentLeft) / 100;
				const tradeTypeOptions = [
					{ label: 'buy', value: 'buy' },
					{ label: 'sell', value: 'sell' }
				];

				const outcome = {
					id: index.toString(),
					marketID: outcomeID,
					name: makeName(index),
					lastPrice: makeNumber(lastPrice, ' ETH'),
					lastPricePercent: makeNumber(lastPrice * 100, '%'),
					trade: {
						side: tradeTypeOptions[0].value,
						numShares: 0,
						limitPrice: 0,
						tradeTypeOptions,
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

							const negater = outcome.trade.side === 'buy' ? -1 : 1;

							const finalLimitPrice = outcome.trade.limitPrice || 1;
							const totEth = outcome.trade.numShares * finalLimitPrice * negater;
							outcome.trade.totalFee = makeNumber(Math.round(m.takerFeePercent.value / 100 * finalLimitPrice * outcome.trade.numShares * 100) / 100, ' ETH');
							const feeFortotalEth = -1 * outcome.trade.totalFee.value;
							outcome.trade.totalCost = makeNumber(Math.round((totEth + feeFortotalEth) * 100) / 100, ' ETH');

							m.outcomes = m.outcomes.map(currentOutcome => {
								if (currentOutcome.id === outcomeID) {
									return outcome;
								}
								return currentOutcome;
							});

							const gas = 0.03;

							m.tradeSummary = m.outcomes.reduce((p, outcome) => {
								if (!outcome.trade || !outcome.trade.numShares) {
									return p;
								}

								p.tradeOrders.push({
									type: outcome.trade.side,
									shares: makeNumber(outcome.trade.numShares, 'shares'),
									ether: makeNumber(outcome.trade.totalCost.value - gas, ' ETH'),
									data: {
										gasFees: makeNumber(gas, ' ETH'),
										marketType: m.type,
										outcomeName: outcome.name,
										marketDescription: m.description,
										avgPrice: makeNumber(Math.round((outcome.trade.totalCost.value / outcome.trade.numShares) * 100) / 100, ' ETH'),
									}
								});

								return p;
							}, { totalGas: 0, tradeOrders: [] });

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

				outcome.userOpenOrders = marketIndex === 5 ? [] : [...new Array(randomInt(1, 6)).keys()].map(index => (
					{
						id: `${m.id}${outcome.id}order${index}`,
						type: parseInt(index, 10) % 2 === 1 ? 'buy' : 'sell',
						marketID: m.id,
						avgPrice: makeNumber(parseFloat(Math.random().toFixed(2)), ' ETH'),
						unmatchedShares: makeNumber(parseInt(Math.random() * 10, 10), 'shares'),
						outcome: outcomeID,
						owner: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa'
					}
				));

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
