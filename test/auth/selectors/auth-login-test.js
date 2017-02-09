import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('modules/auth/selectors/auth-login.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore();

      const mockSubmitLogin = { login: () => {} };
      const mockLinks = { selectAirbitzLink: {} };

      sinon.stub(mockSubmitLogin, 'login', () => (dispatch) => {});

      const selector = proxyquire('../../../src/modules/auth/selectors/auth-login', {
        '../../../store': store,
        '../actions/login': mockSubmitLogin,
        '../../link/selectors/links': mockLinks
      }).default();

      t.assertions(selector, store, mockSubmitLogin);
    });
  };

  test({
    description: `should return the correct object`,
    assertions: (selector, store) => {
      assert.property(selector, 'submitLogin');
      assert.isFunction(selector.submitLogin);
      assert.property(selector, 'airbitzLogin');
    }
  });

  test({
    description: `'submitLogin' should dispatch the correct action`,
    assertions: (selector, store, mockSubmitLogin) => {
      selector.submitLogin();
      assert.isTrue(mockSubmitLogin.login.calledOnce);
    }
  });

  test({
    description: `'airbitzLogin' should return the correct object`,
    assertions: (selector, store) => {
      assert.deepEqual(selector.airbitzLogin, {});
    }
  });
});
