import { assert } from 'chai';
import selectors from '../src/selectors';

describe(`selectors.createMarketForm tests:`, () => {
	it('should contain a createMarketForm object', () => {
		let actual = selectors.createMarketForm;

		assert.isDefined(actual, 'createMarketForm is not defined');
		assert.isObject(actual, 'createMarketForm is not an object');
	});
});
