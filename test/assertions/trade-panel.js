var assert = require('chai').assert;

function tradePanelAssertion(actual) {
	describe('outcomes array', () => {
		// outcomes: array
		it('should be an array', () => {
			assert.isDefined(actual.outcomes, 'outcomes is not defined');
			assert.isArray(actual.outcomes, 'outcomes is not an array');
		});
	});
}
module.exports = tradePanelAssertion;
