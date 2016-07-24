import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';
import assertEndDate from '../../test/assertions/common/end-date';

export default function(market) {

	// market can be undefined
	if (!market.id) {
		return;
	}

	describe('augur-ui-react-components market state', () => {
		it('should exist', () => {
			assert.isDefined(market, `markets is empty.`);
		});

		it('should be an object', () => {
			assert.isObject(market, `markets[0] (market) isn't an object`);
		});

		describe('id', () => {
			it('should exist', () => {
				assert.isDefined(market.id, `id isn't defined.`);
			});

			it('should be a string', () => {
				assert.isString(market.id, `id isn't a string`);
			});
		});

		describe('type', () => {
			it('should exist', () => {
				assert.isDefined(market.type, `type isn't defined.`);
			});

			it('should be a string', () => {
				assert.isString(market.type, `type isn't a string`);
			});
		});

		describe('description', () => {
			it('should exist', () => {
				assert.isDefined(market.description, `description isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(market.description, `description isn't a string`);
			});
		});

		describe('endDate', () => {
			it('should exist', () => {
				assert.isDefined(market.endDate, `endDate isn't defined`);
			});

			it('should have the correct shape', () => {
				assertEndDate(market.endDate, 'market');
			});
		});

		describe('endDateLabel', () => {
			it('should exist', () => {
				assert.isDefined(market.endDateLabel, `market.endDateLabel isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(market.endDateLabel, `market.endDateLabel isn't an string`);
			});
		});

		describe('takerFeePercent', () => {
			it('should receive a takerFeePercent and be an object', () => {
				assert.isDefined(market.takerFeePercent, `market.takerFeePercent isn't defined`);
			});

			it('should have the correct shape', () => {
				assertFormattedNumber(market.takerFeePercent, 'market.takerFeePercent');
			});
		});

		describe('makerFeePercent', () => {
			it('should exist', () => {
				assert.isDefined(market.makerFeePercent, `market.makerFeePercent isn't defined`);
			});

			it('should have the correct shape', () => {
				assertFormattedNumber(market.makerFeePercent, 'market.makerFeePercent');
			});
		});

		describe('volume', () => {
			it('should exist', () => {
				assert.isDefined(market.volume, `market.volume isn't defined`);
			});

			it('should have the correct shape', () => {
				assertFormattedNumber(market.volume, 'market.volume');
			});
		});

		describe('isOpen', () => {
			it('should exist', () => {
				assert.isDefined(market.isOpen, `market.isOpen isn't defined`);
			});

			it('should be a boolean', () => {
				assert.isBoolean(market.isOpen, `market.isOpen isn't a boolean`);
			});
		});

		describe('isPendingReport', () => {
			it('should exist', () => {
				assert.isDefined(market.isPendingReport, `market.isPendingReport isn't defined`);
			});

			it('should be a boolean', () => {
				assert.isBoolean(market.isPendingReport, `market.isPendingReport isn't a boolean`);
			});
		});

		describe('marketLink', () => {
			it('should receive a marketLink and be an object', () => {
				assert.isDefined(market.marketLink, `market.marketLink isn't defined`);
			});

			it('should have the correct shape', () => {
				assertMarketLink(market.marketLink);
			});
		});

		describe('tags', () => {

			let tags = market.tags;

			it('should exist', () => {
				assert.isDefined(tags, `market.tags isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(tags, `market.tags isn't an array`);
			});

			tags.map((tag, i) => {
				describe(`tag ${i}`, () => {
					describe('name', () => {
						it('should exist', () => {
							assert.isDefined(tag.name, 'name is not defined');
						});

						it('should be a string', () => {
							assert.isString(tag.name, 'name is not a string');
						});
					});

					describe('onClick', () => {
						it('should exist', () => {
							assert.isDefined(tag.onClick, 'onClick is not defined');
						});

						it('should be a function', () => {
							assert.typeOf(tag.onClick, 'function', 'name is not a function');
						});
					});
				});
			});
		});

		describe('outcomes', () => {
			it('should exist', () => {
				assert.isDefined(market.outcomes, `market.outcomes isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(market.outcomes, `market.outcomes isn't an array`);
			});

			market.outcomes.map((outcome, i) => {
				describe(`outcome ${i}`, () => {
					describe('id', () => {
						it('should exist', () => {
							assert.isDefined(outcome.id, 'id does not exist');
						});

						it('should be a string', () => {
							assert.isString(outcome.id, 'id is not a string');
						});
					});

					describe('name', () => {
						it('should exist', () => {
							assert.isDefined(outcome.name, 'name does not exist');
						});

						it('should be a string', () => {
							assert.isString(outcome.name, 'name is not a string');
						});
					});

					describe('marketID', () => {
						it('should exist', () => {
							assert.isDefined(outcome.marketID, 'marketID does not exist');
						});

						it('should be a string', () => {
							assert.isString(outcome.marketID, 'marketID is not a string');
						});
					});

					describe('lastPrice', () => {
						it('should exist', () => {
							assert.isDefined(outcome.lastPrice, 'lastPrice does not exist');
						});

						it('should have the correct shape', () => {
							assertFormattedNumber(outcome.lastPrice, `market.outcomes[${i}].lastPrice`);
						});
					});

					describe('lastPricePercent', () => {
						it('should exist', () => {
							assert.isDefined(outcome.lastPricePercent, 'lastPricePercent does not exist');
						});

						it('should have the correct shape', () => {
							assertFormattedNumber(outcome.lastPricePercent, `market.outcomet[${i}].lastPricePercent`);
						});
					});

					describe('trade', () => {
						let trade = outcome.trade;

						it('should exist', () => {
							assert.isDefined(trade, 'trade does not exist');
						});

						it('should be an object', () => {
							assert.isObject(trade, 'trade is not an object');
						});

						describe('side', () => {
							it('should exist', () => {
								assert.isDefined(trade.side, 'side does not exist');
							});

							it('should be a string', () => {
								assert.isString(trade.side, 'side is not a string');
							});
						});

						describe('numShares', () => {
							it('should exist', () => {
								assert.isDefined(trade.numShares, 'numShares does not exist');
							});

							it('should be a number', () => {
								assert.isNumber(trade.numShares, 'numShares is not a number');
							});
						});

						describe('limitPrice', () => {
							it('should exist', () => {
								assert.isDefined(trade.limitPrice, 'limitPrice does not exist');
							});

							it('should be a number', () => {
								assert.isNumber(trade.limitPrice, 'limitPrice is not a number');
							});
						});

						describe('tradeSummary', () => { // NOTE -- shallow check here due to deep check further down of the same selector method
							it('should exist', () => {
								assert.isDefined(trade.tradeSummary, 'tradeSummary does not exist');
							});

							it('should be a number', () => {
								assert.isObject(trade.tradeSummary, 'tradeSummary is not a object');
							});
						});

						describe('updateTradeOrder', () => {
							it('should exist', () => {
								assert.isDefined(trade.updateTradeOrder, 'updateTradeOrder does not exist');
							});

							it('should be a function', () => {
								assert.typeOf(trade.updateTradeOrder, 'function', 'updateTradeOrder is not a function');
							});
						});
					});

					describe('orderBook', () => { // NOTE -- shallow check here due to deep check further down of the same selector method
						let orderBook = outcome.orderBook;

						it('should exist', () => {
							assert.isDefined(orderBook, 'orderBook does not exist');
						});

						it('should be a function', () => {
							assert.isObject(orderBook, 'orderBook is not an object');
						});

						describe('bids', () => {
							it('should exist', () => {
								assert.isDefined(orderBook.bids, `bids isn't defined`);
							});

							it('should be an array', () => {
								assert.isArray(orderBook.bids, `bids isn't an array`);
							});
						});

						describe('asks', () => {
							it('should exist', () => {
								assert.isDefined(orderBook.asks, `asks isn't defined`);
							});

							it('should be an array', () => {
								assert.isArray(orderBook.asks, `asks isn't an array`);
							});
						});
					});

					describe('topBid', () => { // NOTE -- shallow check here due to deep check further down of the same selector method
						it('should exist', () => {
							assert.isDefined(outcome.topBid, 'topBid does not exist');
						});
					});

					describe('topAsk', () => { // NOTE -- shallow check here due to deep check further down of the same selector method
						it('should exist', () => {
							assert.isDefined(outcome.topAsk, 'topAsk does not exist');
						});
					});
				});
			});
		});

		describe('reportableOutcomes', () => { // NOTE -- other outcomes reside in this array, only testing unique item
			it('should exist', () => {
				assert.isDefined(market.reportableOutcomes, `market.reportableOutcomes isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(market.reportableOutcomes, `market.reportableOutcomes isn't an array`);
			});

			describe('indeterminate outcome', () => {
				const indeterminateItem = market.reportableOutcomes[market.reportableOutcomes.length - 1];

				it('should exist', () => {
					assert.isDefined(indeterminateItem, 'indeterminateItem does not exist');
				});

				it('should be an object', () => {
					assert.isObject(indeterminateItem, 'indeterminateItem is not an object');
				});

				describe('id', () => {
					it('should exist', () => {
						assert.isDefined(indeterminateItem.id, 'id does not exist');
					});

					it('should be a string', () => {
						assert.isString(indeterminateItem.id, 'id is not a string');
					});
				});

				describe('name', () => {
					it('should exist', () => {
						assert.isDefined(indeterminateItem.name, 'name does not exist');
					});

					it('should be a string', () => {
						assert.isString(indeterminateItem.name, 'name is not a string');
					});
				});
			});
		});

		describe('tradeSummary', () => {
			let tradeSummary = market.tradeSummary;

			it('should exist', () => {
				assert.isDefined(tradeSummary, 'tradeSummary is not defined');
			});

			it('should be an object', () => {
				assert.isObject(tradeSummary, 'tradeSummary is not an object');
			});

			describe('totalShares', () => {
				it('should exist', () => {
					assert.isDefined(tradeSummary.totalShares, 'totalShares is not defined');
				});

				it('should have the correct shape', () => {
					assertFormattedNumber(tradeSummary.totalShares, 'market.tradeSummary.totalShares');
				});
			});

			describe('totalEther', () => {
				it('should exist', () => {
					assert.isDefined(tradeSummary.totalEther, 'totalEther is not defined');
				});

				it('should have the correct shape', () => {
					assertFormattedNumber(tradeSummary.totalEther, 'market.tradeSummary.totalEther');
				});
			});

			describe('totalGas', () => {
				it('should exist', () => {
					assert.isDefined(tradeSummary.totalGas, 'totalGas is not defined');
				});

				it('should have the correct shape', () => {
					assertFormattedNumber(tradeSummary.totalGas, 'market.tradeSummary.totalGas');
				});
			});

			describe('feeToPay', () => {
				it('should exist', () => {
					assert.isDefined(tradeSummary.feeToPay, 'feeToPay is not defined');
				});

				it('should have the correct shape', () => {
					assertFormattedNumber(tradeSummary.feeToPay, 'market.tradeSummary.feeToPay');
				});
			});

			describe('tradeOrders', () => {
				let tradeOrders = tradeSummary.tradeOrders;

				it('should exist', () => {
					assert.isDefined(tradeOrders, 'tradeOrders is not defined');
				});

				it('should be an array', () => {
					assert.isArray(tradeOrders, 'tradeOrders is not an array');
				});

				tradeOrders.map((trade, i) => {
					describe(`tradeOrder shape for ${i}`, () => {

						describe('shares', () => {
							it('should be defined', () => {
								assert.isDefined(trade.shares, 'shares is not defined');
							});
							it('should be an object', () => {
								assert.isObject(trade.shares, 'shares is not an object');
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(trade.shares)
							});
						});

						describe('sharesNegative', () => {
							it('should be defined', () => {
								assert.isDefined(trade.sharesNegative, 'shares is not defined');
							});
							it('should be an object', () => {
								assert.isObject(trade.sharesNegative, 'shares is not an object');
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(trade.sharesNegative)
							});
						});

						describe('limitPrice', () => {
							it('should be defined', () => {
								assert.isDefined(trade.limitPrice , `limitPrice isn't defined`);
							});

							it('should be a number', () => {
								assert.isNumber(trade.limitPrice, `limitPrice isn't a number`);
							});
						});

						describe('ether', () => {
							it('should be defined', () => {
								assert.isDefined(trade.ether, 'ether is not defined');
							});

							it('should be an object', () => {
								assert.isObject(trade.ether, 'ether is not an object');
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(trade.ether)
							});
						});

						describe('etherNegative', () => {
							it('should be defined', () => {
								assert.isDefined(trade.etherNegative, 'etherNegative is not defined');
							});

							it('should be an object', () => {
								assert.isObject(trade.etherNegative, 'etherNegative is not an object');
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(trade.etherNegative)
							});
						});

						describe('feeToPay', () => {
							it('should be defined', () => {
								assert.isDefined(trade.feeToPay, 'feeToPay is not defined');
							});

							it('should be an object', () => {
								assert.isObject(trade.feeToPay, 'feeToPay is not an object');
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(trade.feeToPay)
							});
						});

						describe('profitLoss', () => {
							it('should be defined', () => {
								assert.isDefined(trade.profitLoss, 'profitLoss is not defined');
							});

							it('should be an object', () => {
								assert.isObject(trade.profitLoss, 'profitLoss is not an object');
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(trade.profitLoss)
							});
						});

						describe('gas', () => {
							it('should be defined', () => {
								assert.isDefined(trade.gas, 'gas is not defined');
							});

							it('should be an object', () => {
								assert.isObject(trade.gas, 'gas is not an object');
							});
							describe('value', () => {
								it('should be defined', () => {
									assert.isDefined(trade.gas.value, 'gas is not defined');
								});

								it('should be a number', () => {
									assert.isNumber(trade.gas.value, 'gas is not a number');
								});
							});
						});

						describe('data', () => {
							it('should be defined', () => {
								assert.isDefined(trade.data, 'data is not defined');
							});

							it('should be an object', () => {
								assert.isObject(trade.data, 'data is not an object');
							});

							describe('marketID', () => {
								it('should be defined', () => {
									assert.isDefined(trade.data.marketID, `marketID is not defined`);
								});

								it('should be a string', () => {
									assert.isString(trade.data.marketID, `marketID is not a string`);
								});
							});

							describe('outcomeID', () => {
								it('should be defined', () => {
									assert.isDefined(trade.data.outcomeID, `outcomeID is not defined`);
								});

								it('should be a string', () => {
									assert.isString(trade.data.outcomeID, `outcomeID is not a string`);
								});
							});

							describe('marketDescription', () => {
								it('should be defined', () => {
									assert.isDefined(trade.data.marketDescription, `marketDescription is not defined`);
								});

								it('should be a string', () => {
									assert.isString(trade.data.marketDescription, `marketDescription is not a string`);
								});
							});

							describe('outcomeName', () => {
								it('should be defined', () => {
									assert.isDefined(trade.data.outcomeName, `outcomeName is not defined`);
								});

								it('should be a string', () => {
									assert.isString(trade.data.outcomeName, `outcomeName is not a string`);
								});
							});

							describe('avgPrice', () => {
								it('should be defined', () => {
									assert.isDefined(trade.data.avgPrice, 'avgPrice is not defined');
								});

								it('should be an object', () => {
									assert.isObject(trade.data.avgPrice, 'avgPrice is not an object');
								});

								it('should have the correct shape', () => {
									assertFormattedNumber(trade.data.avgPrice)
								});
							});
						});
					});
				});
			});
		});

		describe('priceTimeSeries', () => {
			it('[TODO] flesh out the full shape'); // Holding on this temporarily until we can better test trading

			it('should exist', () => {
				assert.isDefined(market.priceTimeSeries, `market.priceTimeSeries isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(market.priceTimeSeries, `market.priceTimeSeries isn't an array`);
			});
		});

		describe('positionsSummary', () => {
			let positionsSummary = market.positionsSummary;

			it('should exist', () => {
				assert.isDefined(positionsSummary, 'positionsSummary is not defined');
			});

			it('should be an object', () => {
				assert.isObject(positionsSummary, 'positionsSummary is not an object');
			});

			describe('numPositions', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.numPositions, 'numPositions is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.numPositions, 'market.positionsSummary.numPositions');
				});
			});

			describe('qtyShares', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.qtyShares, 'qtyShares is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.qtyShares, 'market.positionsSummary.qtyShares');
				});
			});

			describe('purchasePrice', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.purchasePrice, 'purchasePrice is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.purchasePrice, 'market.positionsSummary.purchasePrice');
				});
			});

			describe('totalValue', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.totalValue, 'totalValue is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.totalValue, 'market.positionsSummary.totalValue');
				});
			});

			describe('totalCost', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.totalCost, 'totalCost is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.totalCost, 'market.positionsSummary.totalCost');
				});
			});

			describe('shareChange', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.shareChange, 'shareChange is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.shareChange, 'market.positionsSummary.shareChange');
				});
			});

			describe('gainPercent', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.gainPercent, 'gainPercent is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.gainPercent, 'market.positionsSummary.gainPercent');
				});
			});

			describe('netChange', () => {
				it('should exist', () => {
					assert.isDefined(positionsSummary.netChange, 'netChange is not defined');
				});

				it('should be the correct shape', () => {
					assertFormattedNumber(positionsSummary.netChange, 'market.positionsSummary.netChange');
				});
			});
		});

		describe('report', () => {
			const report = market.report;

			it('should exist', () => {
				assert.isDefined(report, `market.report isn't defined`);
			});

			it('should be an object', () => {
				assert.isObject(report, 'report is not an object');
			});

			describe('isUnethical', () => {
				it('should exist', () => {
					assert.isDefined(report.isUnethical, `isUnethical isn't defined`);
				});

				it('should be a boolean', () => {
					assert.isBoolean(report.isUnethical, `isUnethical isn't a boolean`);
				});
			});

			describe('onSubmitReport', () => {
				it('should exist', () => {
					assert.isDefined(report.onSubmitReport, `onSubmitReport isn't defined`);
				});

				it('should be a function', () => {
					assert.typeOf(report.onSubmitReport, 'function', `onSubmitReport isn't a function`);
				});
			});
		});

		describe('orderBook', () => {
			it('[TODO] further assert shape');

			it('should receive an orderBook and be an object', () => {
				assert.isDefined(market.orderBook, `market.orderBook isn't defined`);
			});

			it('should be an object', () => {
				assert.isObject(market.orderBook, `market.orderBook isn't an object`);
			});
		});

		describe('onSubmitPlaceTrade', () => {
			let onSubmitPlaceTrade = market.onSubmitPlaceTrade;

			it('should exist', () => {
				assert.isDefined(onSubmitPlaceTrade, `onSubmitPlaceTrade isn't a function`);
			});

			it('should be a function', () => {
				assert.isFunction(onSubmitPlaceTrade, `onSubmitPlaceTrade isn't a function`);
			});
		});
	});
}

function assertMarketLink(marketLink) {
	assert.isDefined(marketLink, `market.marketLink isn't defined`);
	assert.isObject(marketLink, `market.marketLink isn't an object`);
	assert.isDefined(marketLink.text, `market.marketLink.text isn't defined`);
	assert.isString(marketLink.text, `market.marketLink.text isn't a string`);
	assert.isDefined(marketLink.className, `market.marketLink.className isn't defined`);
	assert.isString(marketLink.className, `market.marketLink.className isn't a string`);
	assert.isDefined(marketLink.onClick, `market.marketLink.onClick isn't defined`);
	assert.isFunction(marketLink.onClick, `market.marketLink.onClick isn't a function`);
}
