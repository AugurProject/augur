import { assert } from 'chai';

import * as selector from '../../../src/modules/portfolio/selectors/summaries';

describe('modules/portfolio/selectors/summaries', () => {
	let expected, actual;

	expected = [];

	actual = selector.default();

	it('should return the expected array', () => {
		assert.deepEqual(expected, actual, `Didn't return the expected array`);
	});
});