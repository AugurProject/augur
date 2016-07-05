import { assert } from 'chai';
import numberShape from '../../test/assertions/common/numberShape';

function sideOptions(actual) {
	describe('augur-ui-react-components trade sideOptions state', () => {
		it('should exist', () => {
			assert.isDefined(actual, 'outcomes is not defined');
		});

		it('should be an array', () => {
			assert.isArray(actual, 'outcomes is not an array');
		});
	})
}

function updateSelectedOutcome(actual){
	describe('augur-ui-react-components trade updateSelectedOutcome state', () => {
		let updateSelectedOutcome = actual.updateSelectedOutcome;

		it('should exist', () => {
			assert.isDefined(updateSelectedOutcome, 'updateSelectedOutcome is not a function');
		});

		it('should be a function', () => {
			assert(typeof updateSelectedOutcome === 'function', 'updateSelectedOutcome is not a function');
		});
	});
}

function selectedOutcomeID(actual){
	describe('augur-ui-react-components trade selectedOutcomeID state', () => {
		let selectedOutcomeID = actual.selectedOutcomeID;

		it('should exist', () => {
			assert.isDefined(selectedOutcomeID, 'selectedOutcomeID is not defined');
		});

		it('initially should be null', () => {
			assert.isNull(selectedOutcomeID, 'selectedOutcomeID is not null');
		});
	});
}

function tradeSummary(actual){
	describe('augur-ui-react-components trade tradeSummary', () => {
		it('should exist', () => {
			assert.isDefined(actual, 'tradeSummary is not defined');
		});

		it('should be an object', () => {
			assert.isObject(actual, 'tradeSummary is not an object');
		});

		describe('totalShares', () => {
			it('should exist', () => {
				assert.isDefined(actual.totalShares, 'totalShares is not defined');
			});

			it('should be an object', () => {
				assert.isObject(actual.totalShares, 'totalShares is not defined');
			});

			it('should have the correct shape', () => {
				numberShape(actual.totalShares, 'totalShares shape is not correct');
			});
		});

		describe('totalEther', () => {
			it('should exist', () => {
				assert.isDefined(actual.totalEther, 'totalEther is not defined');
			});

			it('should be an object', () => {
				assert.isObject(actual.totalEther, 'totalEther is not defined');
			});

			it('should have the correct shape', () => {
				numberShape(actual.totalEther, 'totalEther shape is not correct');
			});
		});

		describe('totalGas', () => {
			it('should exist', () => {
				assert.isDefined(actual.totalGas, 'totalGas is not defined');
			});

			it('should be an object', () => {
				assert.isObject(actual.totalGas, 'totalGas is not defined');
			});

			it('should have the correct shape', () => {
				numberShape(actual.totalGas, 'totalGas shape is not correct');
			});
		});

		describe('tradeOrders', () => {
			let tradeOrders = actual.tradeOrders;

			it('should exist', () => {
				assert.isDefined(actual.tradeOrders, 'tradeOrders is not defined');
			});

			it('should be an array', () => {
				assert.isArray(actual.tradeOrders, 'tradeOrders is not an array');
			});

			actual.tradeOrders.map((trade, i) => {
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
}

function onSubmitPlaceTrade(actual){
	describe('augur-ui-react-components trade onSubmitPlaceTrade', () => {
		let onSubmitPlaceTrade = actual.onSubmitPlaceTrade;

		it('should exist', () => {
			assert.isDefined(onSubmitPlaceTrade, 'onSubmitPlaceTrade is not a function');
		});

		it('should be a function', () => {
			assert(typeof onSubmitPlaceTrade === 'function', 'onSubmitPlaceTrade is not a function');
		});
	});
}

module.exports = {
	sideOptions,
	updateSelectedOutcome,
	selectedOutcomeID,
	tradeSummary,
	onSubmitPlaceTrade
};
