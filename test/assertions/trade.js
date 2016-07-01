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
	describe('tradeOrders', () => {
		let tradeOrders = actual.markets[0].tradeSummary.tradeOrders;

		it('should exist', () => {
			assert.isDefined(tradeOrders, 'tradeOrders is not defined');
		});

		it('should be an array', () => {
			assert.isArray(tradeOrders, 'tradeOrders is not an array');
		});
	});
}

function tradeSummary(actual){
	describe('tradeSummary', () => {
		let tradeSummary = actual.markets[0].tradeSummary;

		it('should exist', () => {
			assert.isDefined(tradeSummary, 'tradeSummary is not defined');
		});

		it('should be an object', () => {
			assert.isObject(tradeSummary, 'tradeSummary is not an object');
		});
	});
}

function onSubmitPlaceTrade(actual){
	describe('onSubmitPlaceTrade', () => {
		let onSubmitPlaceTrade = actual.markets[0].onSubmitPlaceTrade;

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
