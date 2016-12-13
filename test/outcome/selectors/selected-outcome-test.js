import { describe, it } from 'mocha';
import { assert } from 'chai';
import selector from 'src/selectors';
import selectedOutcomeAssertions from 'assertions/selected-outcome';

describe('modules/outcome/selectors/selected-outcome.js', () => {
	const actual = selector.selectedOutcome;

	it('should produce the expected initial state', () => {
		assert.isNull(actual.selectedOutcomeID, 'selectedOutcomeID initial state is not null');
		assert.typeOf(actual.updateSelectedOutcome, 'function', 'updateSelectedOutcome is not a function');
	});

	it('should provide the expected object to components', () => {
		selectedOutcomeAssertions(actual);
	});
});
