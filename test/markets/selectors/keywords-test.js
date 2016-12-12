import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
// import assertions from 'augur-ui-react-components/lib/assertions';

describe('modules/markets/selectors/keywords.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const { store } = mockStore.default;

	const mockUpdate = {
		updateKeywords: () => {}
	};
	sinon.stub(mockUpdate, 'updateKeywords', keywords => ({
		type: 'UPDATE_KEYWORDS',
		keywords
	}));

	const selector = proxyquire('../../../src/modules/markets/selectors/keywords.js', {
		'../../../store': store,
		'../../markets/actions/update-keywords': mockUpdate
	});

	it(`should return the active keywords`, () => {
		const keywords = store.getState().keywords;
		const actual = selector.default();
		const expected = [{
			type: 'UPDATE_KEYWORDS',
			keywords
		}];

		actual.onChangeKeywords(keywords);
		// assertions.keywords(actual);

		assert(mockUpdate.updateKeywords.calledOnce, `updateKeywords wasn't called once as expected`);
		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the correct action when onChangeKeywords was called.`);
	});
});
