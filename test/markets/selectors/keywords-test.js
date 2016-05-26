import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

let keywords;
describe('modules/markets/selectors/keywords.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, out, test;
	let state = Object.assign({}, testState, {
		keywords: ['test', 'example', 'foobar']
	});
	store = mockStore(state);
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

	keywords = selector.default;
	it(`should return the active keywords`, () => {
		let keywords = store.getState().keywords;
		test = selector.default();
		out = [{
			type: 'UPDATE_KEYWORDS',
			keywords
		}];

		test.onChangeKeywords(keywords);

		assert.equal(test.value, keywords, `Didn't assign the current keywords as a "value" of output object`);
		assert(mockUpdate.updateKeywords.calledOnce, `updateKeywords wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action when onChangeKeywords was called.`);
	});
});

export default keywords;
