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

module.exports = {
	outcomes,
	sideOptions
};
