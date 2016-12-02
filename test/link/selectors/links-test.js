import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
// import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/link/selectors/links.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const { store } = mockStore.default;

	const selector = proxyquire('../../../src/modules/link/selectors/links', {
		'../../../store': store
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		// global.window = {};
		store.clearActions();
	});

	it(`should have the expected shape`, () => {
		const actual = selector.default();
		assert.exists(actual);  // TODO -- remove
		// console.log(actual);
		// assertions.links(actual);
	});
});
