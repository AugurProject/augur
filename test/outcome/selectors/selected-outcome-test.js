import { assert } from 'chai';
import selector from '../../../src/selectors'
import { assertions } from 'augur-ui-react-components';

describe('modules/outcome/selectors/selected-outcome.js', () => {
	let actual = selector.selectedOutcome;

	it('should produce the expected initial state', () => {
		assert.isNull(actual.selectedOutcomeID, 'selectedOutcomeID initial state is not null');
		assert.typeOf(actual.updateSelectedOutcome, 'function', 'updateSelectedOutcome is not a function');
	});

	it('should provide the expected object to components', () => {
		assertions.selectedOutcome(actual);
	});
});