import { assert } from 'chai';

function outcomes(actual) {
	describe('outcomes', () => {
		let outcomes = actual.markets[0].outcomes; // Simply test the first market object

		it('should exist', () => {
			assert.isDefined(outcomes, 'outcomes is not defined');
		});

		it('should be an array', () => {
			assert.isArray(outcomes, 'outcomes is not an array');
		});
	});
}

function sideOptions(actual) {
	describe('sideOptions', () => {
		it('should exist', () => {
			assert.isDefined(actual.sideOptions, 'outcomes is not defined');
		});

		it('should be an array', () => {
			assert.isArray(actual.sideOptions, 'outcomes is not an array');
		});
	})
}

function updateSelectedOutcome(actual){
	describe('updateSelectedOutcome', () => {
		let selectedOutcome = actual.selectedOutcome;

		it('should exist', () => {
			assert.isDefined(selectedOutcome.updateSelectedOutcome, 'updateSelectedOutcome is not a function');
		});

		it('should be a function', () => {
			assert(typeof selectedOutcome.updateSelectedOutcome === 'function', 'updateSelectedOutcome is not a function');
		});
	});
}

function selectedOutcomeID(actual){
	describe('selectedOutcomeID', () => {
		let selectedOutcomeID = actual.selectedOutcome.selectedOutcomeID;

		it('should exist', () => {
			assert.isDefined(selectedOutcomeID, 'selectedOutcomeID is not defined');
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

module.exports = {
	outcomes,
	sideOptions,
	updateSelectedOutcome,
	selectedOutcomeID,
	tradeOrders
};
