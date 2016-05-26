import {assert} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from './testState';

import activePage from './app/selectors/active-page-test';
import loginAccount from './auth/selectors/login-account-test';
import links from './link/selectors/links-test';
import authForm from './auth/selectors/auth-form-test';
import marketsHeader from './markets/selectors/markets-header-test';

let selectors;
describe('ui tests', () => {
	proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  let state = Object.assign({}, testState);
  store = mockStore(state);

	selectors = proxyquire('../src/selectors.js', {
		'./modules/app/selectors/active-page': activePage,
		'./modules/auth/selectors/login-account': loginAccount,
		'./modules/link/selectors/links': links,
		'./modules/auth/selectors/auth-form': authForm,
		'./modules/markets/selectors/markets-header': marketsHeader
	});

	it(`should do some stuff`, () => {
		console.log(selectors.activePage);
		console.log(selectors.loginAccount);
		console.log(selectors.links);
		console.log(selectors.authForm);
		console.log(selectors.marketsHeader);
	});
});

export default selectors;
