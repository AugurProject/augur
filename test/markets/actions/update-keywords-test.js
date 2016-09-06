import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';

describe(`modules/markets/actions/update-keywords.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	let out, action;
	let { state, store } = mockStore.default;
	let mockUpdateURL = { updateURL: () => {} };

	sinon.stub(mockUpdateURL, 'updateURL', (href) => {
		return { type: 'UPDATE_URL', href };
	});

	action = proxyquire('../../../src/modules/markets/actions/update-keywords', {
		'../../link/actions/update-url': mockUpdateURL,
		'../../../selectors': proxyquire('../../../src/selectors', {
			'./modules/link/selectors/links': proxyquire('../../../src/modules/link/selectors/links', {
				'../../../store': store
			})
		})
	});

	beforeEach(() => {
		store.clearActions();
		// Mock the Window object
		global.window = {};
		global.window.location = {
			pathname: '/',
			search: '?isOpen=true'
		};
		global.window.history = {
			pushState: (a, b, c) => true
		};
		global.window.scrollTo = (x, y) => true;
	});

	afterEach(() => {
		store.clearActions();
		global.window = {};
	});

	it(`should dispatch UPDATE_KEYWORDS action correctly`, () => {
		const keywords = ['key', 'words'];
		out = [{
			type: 'UPDATE_KEYWORDS',
			keywords: ['key', 'words']
		}, {
			type: 'UPDATE_URL',
			href: '/?search=test%20testtag&filters=isOpen&tags=testtag%2Ctag'
		}];

		store.dispatch(action.updateKeywords(keywords));

		assert.deepEqual(store.getActions(), out, `updatekeywords action didn't dispatch properly`);
	});
});
