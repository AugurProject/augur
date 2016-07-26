import {assert} from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';
import assertEndDate from '../../test/assertions/common/end-date';

export default function (market) {

	// market can be undefined
	if (!market.id) {
		return;
	}

	describe('augur-ui-react-components market state', () => {
		it('market', () => {
			assert.isDefined(market);
			assert.isObject(market);
		});

		it('market.id', () => {
			assert.isDefined(market.id);
			assert.isString(market.id);
		});

		it('market.type', () => {
			assert.isDefined(market.type);
			assert.isString(market.type);
		});

		it('market.description', () => {
			assert.isDefined(market.description);
			assert.isString(market.description);
		});

		it('market.endDate', () => {
			assert.isDefined(market.endDate);
			assertEndDate(market.endDate);
		});

		it('market.endDateLabel', () => {
			assert.isDefined(market.endDateLabel);
			assert.isString(market.endDateLabel);
		});

		it('market.takerFeePercent', () => {
			assert.isDefined(market.takerFeePercent);
			assertFormattedNumber(market.takerFeePercent);
		});

		it('market.makerFeePercent', () => {
			assert.isDefined(market.makerFeePercent);
			assertFormattedNumber(market.makerFeePercent);
		});

		it('market.volume', () => {
			assert.isDefined(market.volume);
			assertFormattedNumber(market.volume);
		});

		it('market.isOpen', () => {
			assert.isDefined(market.isOpen);
			assert.isBoolean(market.isOpen);
		});

		it('market.isPendingReport', () => {
			assert.isDefined(market.isPendingReport);
			assert.isBoolean(market.isPendingReport);
		});

		it('market.marketLink', () => {
			assert.isDefined(market.marketLink);
			assertMarketLink(market.marketLink);
		});

		const tags = market.tags;
		it('market.tags', () => {
			assert.isDefined(tags);
			assert.isArray(tags);

			tags.forEach((tag, i) => {
				it(`market.tags[${i}].name`, () => {
					assert.isDefined(tag.name);
					assert.isString(tag.name);
				});

				it(`market.tags[${i}].onCLick`, () => {
					assert.isDefined(tag.onClick);
					assert.isFunction(tag.onClick);
				});
			});
		});

		it('market.outcomes', () => {
			assert.isDefined(market.outcomes);
			assert.isArray(market.outcomes);

			market.outcomes.forEach((outcome, i) => {
				it(`market.outcomes[${i}]`, () => {
					assert.isDefined(outcome);
					assert.isObject(outcome);
				});

				it(`market.outcomes[${i}].id`, () => {
					assert.isDefined(outcome.id);
					assert.isString(outcome.id);
				});

				it(`market.outcomes[${i}].name`, () => {
					assert.isDefined(outcome.name);
					assert.isString(outcome.name);
				});

				it(`market.outcomes[${i}].marketID`, () => {
					assert.isDefined(outcome.marketID);
					assert.isString(outcome.marketID);
				});

				it(`market.outcomes[${i}].lastPrice`, () => {
					assert.isDefined(outcome.lastPrice);
					assertFormattedNumber(outcome.lastPrice);
				});

				it(`market.outcomes[${i}].lastPricePercent`, () => {
					assert.isDefined(outcome.lastPricePercent);
					assertFormattedNumber(outcome.lastPricePercent);
				});

				const trade = outcome.trade;
				it(`market.outcomes[${i}].trade`, () => {
					assert.isDefined(trade);
					assert.isObject(trade);
				});

				it(`market.outcomes[${i}].trade.side`, () => {
					assert.isDefined(trade.side);
					assert.isString(trade.side);
				});

				it(`market.outcomes[${i}].trade.numShares`, () => {
					assert.isDefined(trade.numShares);
					assert.isNumber(trade.numShares);
				});

				it(`market.outcomes[${i}].trade.limitPrice`, () => {
					assert.isDefined(trade.limitPrice);
					assert.isNumber(trade.limitPrice);
				});

				it(`market.outcomes[${i}].trade.tradeSummary`, () => {
					// NOTE -- shallow check here due to deep check further down of the same selector method
					assert.isDefined(trade.tradeSummary);
					assert.isObject(trade.tradeSummary);
				});

				it(`market.outcomes[${i}].trade.updateTradeOrder`, () => {
					assert.isDefined(trade.updateTradeOrder);
					assert.isFunction(trade.updateTradeOrder);
				});

				const orderBook = outcome.orderBook;
				it(`market.outcomes[${i}].orderBook`, () => {
					// NOTE -- shallow check here due to deep check further down of the same selector method
					assert.isDefined(orderBook);
					assert.isObject(orderBook);
				});

				it(`market.outcomes[${i}].orderBook.bids`, () => {
					assert.isDefined(orderBook.bids);
					assert.isArray(orderBook.bids);
				});

				it(`market.outcomes[${i}].orderBook.asks`, () => {
					assert.isDefined(orderBook.asks);
					assert.isArray(orderBook.asks);
				});

				it(`market.outcomes[${i}].orderBook.topBid`, () => {
					// NOTE -- shallow check here due to deep check further down of the same selector method
					assert.isDefined(outcome.topBid);
				});

				it(`market.outcomes[${i}].orderBook.topAsk`, () => {
					// NOTE -- shallow check here due to deep check further down of the same selector method
					assert.isDefined(outcome.topAsk);
				});

				const userOpenOrders = outcome.userOpenOrders;
				it(`market.outcomes[${i}].userOpenOrders`, () => {
					assert.isDefined(userOpenOrders);
					assert.isArray(userOpenOrders);
				});

				it(`market.outcomes[${i}].userOpenOrders`, () => {
					assert.isDefined(userOpenOrders);
					assert.isArray(userOpenOrders);
				});

				userOpenOrders.forEach((openOrder, j) => {
					it(`market.outcomes[${i}].userOpenOrders[${j}]`, () => {
						assert.isDefined(openOrder);
						assert.isObject(openOrder);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].id`, () => {
						assert.isDefined(openOrder.id);
						assert.isObject(openOrder.id);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].marketID`, () => {
						assert.isDefined(openOrder.marketID);
						assert.isString(openOrder.marketID);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].outcomeName`, () => {
						assert.isDefined(openOrder.outcomeName);
						assert.isString(openOrder.outcomeName);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].type`, () => {
						assert.isDefined(openOrder.type);
						assert.isString(openOrder.type);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].avgPrice`, () => {
						assert.isDefined(openOrder.avgPrice);
						assert.isObject(openOrder.avgPrice);
						assertFormattedNumber(openOrder.avgPrice);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].unmatchedShares`, () => {
						assert.isDefined(openOrder.unmatchedShares);
						assert.isObject(openOrder.unmatchedShares);
						assertFormattedNumber(openOrder.unmatchedShares);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].isCancelling`, () => {
						assert.isDefined(openOrder.isCancelling);
						assert.isBoolean(openOrder.isCancelling);
					});

					it(`market.outcomes[${i}].userOpenOrders[${j}].isCancelled`, () => {
						assert.isDefined(openOrder.isCancelled);
						assert.isBoolean(openOrder.isCancelled);
					});
				});
			});
		});

		it('market.reportableOutcomes', () => {
			// NOTE -- shallow check here due to deep check further down of the same selector method
			assert.isDefined(market.reportableOutcomes);
			assert.isArray(market.reportableOutcomes);
		});

		const indeterminateItem = market.reportableOutcomes[market.reportableOutcomes.length - 1];
		it('market.reportableOutcomes[market.reportableOutcomes.length - 1] (indeterminateItem)', () => {
			assert.isDefined(indeterminateItem);
			assert.isObject(indeterminateItem);
		});

		it('market.reportableOutcomes[market.reportableOutcomes.length - 1] (indeterminateItem.id)', () => {
			assert.isDefined(indeterminateItem.id);
			assert.isString(indeterminateItem.id);
		});

		it('market.reportableOutcomes[market.reportableOutcomes.length - 1] (indeterminateItem.name)', () => {
			assert.isDefined(indeterminateItem.name);
			assert.isString(indeterminateItem.name);
		});

		const tradeSummary = market.tradeSummary;
		it('market.tradeSummary', () => {
			assert.isDefined(tradeSummary);
			assert.isObject(tradeSummary);
		});

		it('market.tradeSummary.totalShares', () => {
			assert.isDefined(tradeSummary.totalShares);
			assertFormattedNumber(tradeSummary.totalShares);
		});

		it('market.tradeSummary.totalCost', () => {
			assert.isDefined(tradeSummary.totalCost);
			assertFormattedNumber(tradeSummary.totalCost);
		});

		it('market.tradeSummary.totalGas', () => {
			assert.isDefined(tradeSummary.totalGas);
			assertFormattedNumber(tradeSummary.totalGas);
		});

		it('market.tradeSummary.totalFee', () => {
			assert.isDefined(tradeSummary.totalFee);
			assertFormattedNumber(tradeSummary.totalFee);
		});

		const tradeOrders = tradeSummary.tradeOrders;
		it('market.tradeSummary.tradeOrders', () => {
			assert.isDefined(tradeOrders);
			assert.isArray(tradeOrders);
		});

		tradeOrders.map((trade, i) => {
			it(`market.tradeSummary.tradeOrders${i}.shares`, () => {
				assert.isDefined(trade.shares);
				assert.isObject(trade.shares);
				assertFormattedNumber(trade.shares);
			});

			it(`market.tradeSummary.tradeOrders${i}.limitPrice`, () => {
				assert.isDefined(trade.limitPrice);
				assert.isNumber(trade.limitPrice);
			});

			it(`market.tradeSummary.tradeOrders${i}.ether`, () => {
				assert.isDefined(trade.ether);
				assert.isObject(trade.ether);
				assertFormattedNumber(trade.ether);
			});

			it('market.tradeSummary.totalFee', () => {
				assert.isDefined(tradeSummary.totalFee);
				assertFormattedNumber(tradeSummary.totalFee);
			});

			it(`market.tradeSummary.tradeOrders${i}.gas`, () => {
				assert.isDefined(trade.gas);
				assert.isObject(trade.gas);
			});
			it(`market.tradeSummary.tradeOrders${i}.gas.value`, () => {
				assert.isDefined(trade.gas.value);
				assert.isNumber(trade.gas.value);
			});

			it(`market.tradeSummary.tradeOrders${i}.data`, () => {
				assert.isDefined(trade.data);
				assert.isObject(trade.data);
			});

			it(`market.tradeSummary.tradeOrders${i}.data.marketID`, () => {
				assert.isDefined(trade.data.marketID);
				assert.isString(trade.data.marketID);
			});

			it(`market.tradeSummary.tradeOrders${i}.data.outcomeID`, () => {
				assert.isDefined(trade.data.outcomeID);
				assert.isString(trade.data.outcomeID);
			});

			it(`market.tradeSummary.tradeOrders${i}.data.marketDescription`, () => {
				assert.isDefined(trade.data.marketDescription);
				assert.isString(trade.data.marketDescription);
			});

			it(`market.tradeSummary.tradeOrders${i}.data.outcomeName`, () => {
				assert.isDefined(trade.data.outcomeName);
				assert.isString(trade.data.outcomeName);
			});

			it(`market.tradeSummary.tradeOrders${i}.data.avgPrice`, () => {
				assert.isDefined(trade.data.avgPrice);
				assert.isObject(trade.data.avgPrice);
				assertFormattedNumber(trade.data.avgPrice);
			});
		});

		it('[TODO] flesh out the full shape');

		it('market.priceTimeSeries', () => {
			assert.isDefined(market.priceTimeSeries);
			assert.isArray(market.priceTimeSeries);
		});

		const userOpenOrdersSummary = market.userOpenOrdersSummary;
		it('market.userOpenOrdersSummary', () => {
			assert.isDefined(market.userOpenOrdersSummary);
			assert.isObject(market.userOpenOrdersSummary);
		});

		it('market.userOpenOrdersSummary.openOrdersCount', () => {
			assert.isDefined(market.userOpenOrdersSummary.openOrdersCount);
			assertFormattedNumber(market.userOpenOrdersSummary.openOrdersCount);
		});

		const positionsSummary = market.positionsSummary;
		it('market.positionSummary', () => {
			assert.isDefined(positionsSummary);
			assert.isObject(positionsSummary);
		});

		it('market.positionSummary.numPositions', () => {
			assert.isDefined(positionsSummary.numPositions);
			assertFormattedNumber(positionsSummary.numPositions);
		});

		it('market.positionSummary.qtyShares', () => {
			assert.isDefined(positionsSummary.qtyShares);
			assertFormattedNumber(positionsSummary.qtyShares);
		});

		it('market.positionSummary.purchasePrice', () => {
			assert.isDefined(positionsSummary.purchasePrice);
			assertFormattedNumber(positionsSummary.purchasePrice);
		});

		it('market.positionSummary.totalValue', () => {
			assert.isDefined(positionsSummary.totalValue);
			assertFormattedNumber(positionsSummary.totalValue);
		});

		it('market.positionSummary.totalCost', () => {
			assert.isDefined(positionsSummary.totalCost);
			assertFormattedNumber(positionsSummary.totalCost);
		});

		it('market.positionSummary.shareChange', () => {
			assert.isDefined(positionsSummary.shareChange);
			assertFormattedNumber(positionsSummary.shareChange);
		});

		it('market.positionSummary.gainPercent', () => {
			assert.isDefined(positionsSummary.gainPercent);
			assertFormattedNumber(positionsSummary.gainPercent);
		});

		it('market.positionSummary.netChange', () => {
			assert.isDefined(positionsSummary.netChange);
			assertFormattedNumber(positionsSummary.netChange);
		});

		const report = market.report;
		it('market.report', () => {
			assert.isDefined(report);
			assert.isObject(report);
		});

		it('market.report.isUnethical', () => {
			assert.isDefined(report.isUnethical);
			assert.isBoolean(report.isUnethical);
		});

		it('market.report.onSubmitReport', () => {
			assert.isDefined(report.onSubmitReport);
			assert.isFunction(report.onSubmitReport);
		});

		const onSubmitPlaceTrade = market.onSubmitPlaceTrade;
		it('market.onSubmitPlaceTrade', () => {
			assert.isDefined(onSubmitPlaceTrade);
			assert.isFunction(onSubmitPlaceTrade);
		});

		function assertMarketLink(marketLink) {
			assert.isDefined(marketLink);
			assert.isObject(marketLink);
			assert.isDefined(marketLink.text);
			assert.isString(marketLink.text);
			assert.isDefined(marketLink.className);
			assert.isString(marketLink.className);
			assert.isDefined(marketLink.onClick);
			assert.isFunction(marketLink.onClick);
		}
	});
}
