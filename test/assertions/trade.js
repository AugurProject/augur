import { assert } from 'chai';

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

function tradeOrders(actual){
	describe('augur-ui-react-components trade tradeOrders', () => {
		let tradeOrders = actual.tradeOrders;

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
						it('should be an object', () => {
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

						it('should be an object', () => {
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

					it('should be an object', () => {
						assert.isNumber(trade.gas.value, 'gas is not a number');
					});
				});
				});
			});
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
	tradeOrders,
	tradeSummary,
	onSubmitPlaceTrade
};
