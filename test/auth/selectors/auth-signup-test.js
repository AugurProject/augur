import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('modules/auth/selectors/auth-signup.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore();

      const mockRegister = { register: () => {} };
      sinon.stub(mockRegister, 'register', () => (dispatch) => {});

      const selector = proxyquire('../../../src/modules/auth/selectors/auth-signup', {
        '../../../store': store,
        '../actions/register': mockRegister
      }).default();

      t.assertions(selector, store, mockRegister);
    });
  };

  test({
    description: `should return the correct object`,
    assertions: (selector, store) => {
      assert.property(selector, 'getLoginID');
      assert.isFunction(selector.getLoginID);
      assert.property(selector, 'registerAccount');
      assert.isFunction(selector.registerAccount);
    }
  });

  test({
    description: `'getLoginID' should dispatch the correct action`,
    assertions: (selector, store, mockRegister) => {
      selector.getLoginID();

      assert.isTrue(mockRegister.register.calledOnce);
      mockRegister.register.reset();
    }
  });

  test({
    description: `'registerAccount' should dispatch the correct action`,
    assertions: (selector, store, mockRegister) => {
      selector.registerAccount();

      assert.isTrue(mockRegister.register.calledOnce);
      mockRegister.register.reset();
    }
  });
});
