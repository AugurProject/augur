var assert = require('chai').assert;

import percentNumberShape from '../../test/assertions/common/percentNumberShape';
import numberShape from '../../test/assertions/common/numberShape';
import endDataShape from '../../test/assertions/common/endDateShape';

// markets:
//  {
//      id: String,
//      type: String,
//      description: String,
//      endDate: Object,
//			endDateLabel: String,
//      tradingFeePercent: Object,
//      volume: Object,
//      isOpen: Boolean,
//      isPendingReport: Boolean,
//      marketLink: Object,
//      tags: Object,
//      outcomes: Object,
//      reportableOutcomes: Object,
//      tradeSummary: Function,
//      priceTimeSeries: Object,
//      positionsSummary: Object,
//      report: Object
//  },
function marketAssertion(actual) {
	describe('augur-ui-react-components market state', () => {
		it('should exist', () => {
			assert.isDefined(actual, `markets is empty.`)
		});

		it('should be an object', () => {
			assert.isObject(actual, `markets[0] (market) isn't an object`);
		});

		describe('id', () => {
			it('should exist', () => {
				assert.isDefined(actual.id, `id isn't defined.`);
			});

			it('should be a string', () => {
				assert.isString(actual.id, `id isn't a string`);
			});
		});

		describe('type', () => {
			it('should exist', () => {
				assert.isDefined(actual.type, `type isn't defined.`);
			});

			it('should be a string', () => {
				assert.isString(actual.type, `type isn't a string`);
			});
		});

		describe('description', () => {
			it('should exist', () => {
				assert.isDefined(actual.description, `description isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(actual.description, `description isn't a string`);
			});
		});

		describe('endDate', () => {
			it('should exist', () => {
				assert.isDefined(actual.endDate, `endDate isn't defined`);
			});

			it('should have the correct shape', () => {
				endDataShape(actual.endDate, 'endData does not have the correct shape')
			});
		});

		describe('endDateLabel', () => {
			it('should exist', () => {
				assert.isDefined(actual.endDateLabel, `market.endDateLabel isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(actual.endDateLabel, `market.endDateLabel isn't an string`);
			});
		});

		describe('takerFeePercent', () => {
			it('should receive a takerFeePercent and be an object', () => {
				assert.isDefined(actual.takerFeePercent, `market.takerFeePercent isn't defined`);
			});

			it('should have the correct shape', () => {
				percentNumberShape(actual.takerFeePercent);
			});
		});

		describe('makerFeePercent', () => {
			it('should exist', () => {
				assert.isDefined(actual.makerFeePercent, `market.makerFeePercent isn't defined`);
			});

			it('should have the correct shape', () => {
				percentNumberShape(actual.makerFeePercent);
			});
		});

		describe('volume', () => {
			it('should exist', () => {
				assert.isDefined(actual.volume, `market.volume isn't defined`);
			});

			it('should have the correct shape', () => {
				numberShape(actual.volume);
			});
		});

		describe('isOpen', () => {
			it('should exist', () => {
				assert.isDefined(actual.isOpen, `market.isOpen isn't defined`);
			});

			it('should be a boolean', () => {
				assert.isBoolean(actual.isOpen, `market.isOpen isn't a boolean`);
			});
		});

		describe('isPendingReport', () => {
			it('should exist', () => {
				assert.isDefined(actual.isPendingReport, `market.isPendingReport isn't defined`);
			});

			it('should be a boolean', () => {
				assert.isBoolean(actual.isPendingReport, `market.isPendingReport isn't a boolean`);
			});
		});

		describe('marketLink', () => {
			it('should receive a marketLink and be an object', () => {
				assert.isDefined(actual.marketLink, `market.marketLink isn't defined`);
			});

			it('should have the correct shape', () => {
				marketLinkAssertion(actual.marketLink);
			});
		});

		describe('tags', () => {
			it('should exist', () => {
				assert.isDefined(actual.tags, `market.tags isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(actual.tags, `market.tags isn't an array`);
			});
		});
		
		describe('outcomes', () => {
			console.log('outcomes -- ', actual.outcomes);

			it('should exist', () => {
				assert.isDefined(actual.outcomes, `market.outcomes isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(actual.outcomes, `market.outcomes isn't an array`);
			});

			actual.outcomes.map((outcome, i) => {
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

					describe('price', () => {
						it('should exist', () => {
							assert.isDefined(outcome.price, 'price does not exist');
						});

						it('should be a number', () => {
							assert.isNumber(outcome.price, 'price is not a number');
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
							numberShape(outcome.lastPrice);
						});
					});

					describe('lastPricePercent', () => {
						it('should exist', () => {
							assert.isDefined(outcome.lastPricePercent, 'lastPricePercent does not exist');
						});

						it('should have the correct shape', () => {
							percentNumberShape(outcome.lastPricePercent);
						});
					});

					describe('trade', () => {
						let trade = outcome.trade;

						it('should exist', () => {
							assert.isDefined(trade, 'trade does not exist');
						});

						it('should be an object', () => {
							assert.isObject(trade, 'trade is not an object');
						})

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

						it('should be a string', () => {
							assert.isNull(outcome.topBid, 'topBid is not null');
						});
					});

					describe('topAsk', () => { // NOTE -- shallow check here due to deep check further down of the same selector method
						it('should exist', () => {
							assert.isDefined(outcome.topAsk, 'topAsk does not exist');
						});

						it('should be a string', () => {
							assert.isNull(outcome.topAsk, 'topAsk is not null');
						});
					});
				});
			});
		});

		describe('reportableOutcomes', () => {
			it('should exist', () => {
				assert.isDefined(actual.reportableOutcomes, `market.reportableOutcomes isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(actual.reportableOutcomes, `market.reportableOutcomes isn't an array`);
			});
		});

		describe('tradeSummary', () => {
			let tradeSummary = actual.tradeSummary;

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
					numberShape(tradeSummary.totalShares, 'totalShares shape is not correct');
				});
			});

			describe('totalEther', () => {
				it('should exist', () => {
					assert.isDefined(tradeSummary.totalEther, 'totalEther is not defined');
				});

				it('should have the correct shape', () => {
					numberShape(tradeSummary.totalEther, 'totalEther shape is not correct');
				});
			});

			describe('totalGas', () => {
				it('should exist', () => {
					assert.isDefined(tradeSummary.totalGas, 'totalGas is not defined');
				});

				it('should have the correct shape', () => {
					numberShape(tradeSummary.totalGas, 'totalGas shape is not correct');
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
							describe('value', () => {
								it('should be defined', () => {
									assert.isDefined(trade.shares.value, 'shares is not defined');
								});
								it('should be a number', () => {
									assert.isNumber(trade.shares.value, 'shares is not a number');
								});
							});
						});
						describe('ether', () => {
							it('should be defined', () => {
								assert.isDefined(trade.ether, 'ether is not defined');
							});

							it('should be an object', () => {
								assert.isObject(trade.ether, 'ether is not an object');
							});
							describe('value', () => {
								it('should be defined', () => {
									assert.isDefined(trade.ether.value, 'ether is not defined');
								});

								it('should be a number', () => {
									assert.isNumber(trade.ether.value, 'ether is not a number');
								});
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
					});
				});
			});
		});

		describe('priceTimeSeries', () => {
			it('should exist', () => {
				assert.isDefined(actual.priceTimeSeries, `market.priceTimeSeries isn't defined`);
			});

			it('should be an array', () => {
				assert.isArray(actual.priceTimeSeries, `market.priceTimeSeries isn't an array`);
			});
		});

		describe('positionsSummary', () => {
			it('should exist', () => {
				assert.isDefined(actual.positionsSummary, `market.positionsSummary isn't defined`);
			});

			it('should be an object', () => {
				assert.isObject(actual.positionsSummary, `market.positionsSummary isn't an object`);
			});
		});

		describe('report', () => {
			it('should exist', () => {
				assert.isDefined(actual.report, `market.report isn't defined`);
			});

			it('should have the correct shape', () => {
				reportAssertion(actual.report);
			});
		});

		describe('orderBook', () => {
			it('should receive an orderBook and be an object', () => {
				assert.isDefined(actual.orderBook, `market.orderBook isn't defined`);
			});

			it('should be an object', () => {
				assert.isObject(actual.orderBook, `market.orderBook isn't an object`);
			});
		});

		describe('constants', () => {
			it('should receive constants and be an object', () => {
				assert.isDefined(actual.constants, 'market.constants is not defined');
			});

			it('should be an object', () => {
				assert.isObject(actual.constants, 'market.constatn is not an object');
			});
		});
	});
}

// report: {
// 	isUnethical: Boolean,
// 	onSubmitReport: [Function: onSubmitReport]
// }
function reportAssertion(actual) {
	assert.isDefined(actual, `market doesn't have a report object`);
	assert.isObject(actual, `market.report isn't an object`);
	assert.isDefined(actual.isUnethical, `market.report.isUnethical isn't defined`);
	assert.isBoolean(actual.isUnethical, `market.report.isUnethical isn't a boolean`);
	assert.isDefined(actual.onSubmitReport, `market.report.onSubmitReport isn't defined`);
	assert.isFunction(actual.onSubmitReport, `market.report.onSubmitReport isn't a function`);
}
// marketLink: {
// 	text: string,
//   className: string,
//   onClick: [Function: onClick]
// }
function marketLinkAssertion(actual) {
	assert.isDefined(actual, `market.marketLink isn't defined`);
	assert.isObject(actual, `market.marketLink isn't an object`);
	assert.isDefined(actual.text, `market.marketLink.text isn't defined`);
	assert.isString(actual.text, `market.marketLink.text isn't a string`);
	assert.isDefined(actual.className, `market.marketLink.className isn't defined`);
	assert.isString(actual.className, `market.marketLink.className isn't a string`);
	assert.isDefined(actual.onClick, `market.marketLink.onClick isn't defined`);
	assert.isFunction(actual.onClick, `market.marketLink.onClick isn't a function`);
}

module.exports = {
	marketAssertion,
	reportAssertion: reportAssertion,
	marketLinkAssertion: marketLinkAssertion
};
