import { assert } from 'chai';
import { assertions } from 'augur-ui-react-components';

import * as selector from '../../../src/modules/portfolio/selectors/summaries';

describe('modules/portfolio/selectors/summaries', () => {
	let expected, actual;

	expected = [];

	actual = selector.default();

	it('should return the expected array', () => {
		assert.deepEqual(expected, actual, `Didn't return the expected array`);
	});

	it('should deliver the expected shape to augur-ui-react-components', () => {
		assertions.portfolioSummaries(actual);
	});
});