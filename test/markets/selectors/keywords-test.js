import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import { assertions } from 'augur-ui-react-components';

describe('modules/markets/selectors/keywords.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, expected, actual;
	let { state, store } = mockStore.default;

	let mockUpdate = {
		updateKeywords: () => {}
	};
	sinon.stub(mockUpdate, 'updateKeywords', (keywords) => {
		return {
			type: 'UPDATE_KEYWORDS',
			keywords
		}
	});

	selector = proxyquire('../../../src/modules/markets/selectors/keywords.js', {
		'../../../store': store,
		'../../markets/actions/update-keywords': mockUpdate
	});

	it(`should return the active keywords`, () => {
		let keywords = store.getState().keywords;
		actual = selector.default();
		expected = [{
			type: 'UPDATE_KEYWORDS',
			keywords
		}];

		actual.onChangeKeywords(keywords);
		assertions.assertKeywords(actual);

		assert(mockUpdate.updateKeywords.calledOnce, `updateKeywords wasn't called once as expected`);
		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the correct action when onChangeKeywords was called.`);
	});
});
