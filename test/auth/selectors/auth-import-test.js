import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';

describe('modules/auth/selectors/auth-import.js', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore();

      const mockImportAccount = () => {};

      const selector = proxyquire('../../../src/modules/auth/selectors/auth-import', {
        '../../../store': store,
        '../actions/import-account': mockImportAccount
      });

      t.assertions(selector.default(), store);
    });
  };

  test({
    description: `'importAccountFromFile' should return the correct actions`,
    assertions: (selector, store) => {
      console.log('res -- ', selector);

      selector.importAccountFromFile('password', true, { keystore: 'file' });

      console.log('store actions -- ', store.getActions());
    }
  });
});
