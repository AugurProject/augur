import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('modules/auth/selectors/auth-import.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore();

      const mockImportAccount = { importAccount: () => {} };
      sinon.stub(mockImportAccount, 'importAccount', () => (dispatch) => {});

      const selector = proxyquire('../../../src/modules/auth/selectors/auth-import', {
        '../../../store': store,
        '../actions/import-account': mockImportAccount
      }).default();

      t.assertions(selector, store, mockImportAccount);
    });
  };

  test({
    description: `should return the correct object`,
    assertions: (selector, store) => {
      assert.property(selector, 'importAccountFromFile');
      assert.isFunction(selector.importAccountFromFile);
    }
  });

  test({
    description: `'importAccountFromFile' should dispatch the correct action`,
    assertions: (selector, store, mockImportAccount) => {
      selector.importAccountFromFile();

      assert.isTrue(mockImportAccount.importAccount.calledOnce);
    }
  });
});
