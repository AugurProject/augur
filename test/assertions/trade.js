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
	onSubmitPlaceTrade
};
