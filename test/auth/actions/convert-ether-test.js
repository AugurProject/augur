import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { convertToToken, convertToEther, __RewireAPI__ as converEtherRewireAPI } from 'modules/auth/actions/convert-ether';

describe('modules/auth/actions/convert-ether.js', () => {
  const mockStore = configureMockStore([thunk]);

  const test = t => it(t.description, (done) => {
    const store = mockStore(t.state || {});

    t.assertions(done, store);
  });

  afterEach(() => {
    converEtherRewireAPI.__ResetDependency__('augur');
  });

  test({
    description: `should call the expected augur method`,
    assertions: (done, store) => {
      const depositEther = sinon.stub();
      converEtherRewireAPI.__Rewire__('augur', {
        depositEther
      });

      store.dispatch(convertToToken());

      assert(depositEther.calledOnce, `didn't call 'depositEther' once as expected`);

      done();
    }
  });

  test({
    description: `should NOT call the expected augur method if a user isn't logged`,
    state: {
      loginAccount: {}
    },
    assertions: (done, store) => {
      const withdrawEther = sinon.stub();
      converEtherRewireAPI.__Rewire__('augur', { withdrawEther });

      store.dispatch(convertToEther());

      assert.isFalse(withdrawEther.called, `didn't call 'depositEther' once as expected`);

      done();
    }
  });

  test({
    description: `should call the expected augur method if a user isn't logged`,
    state: {
      loginAccount: {
        address: '0xtest'
      }
    },
    assertions: (done, store) => {
      const withdrawEther = sinon.stub();
      converEtherRewireAPI.__Rewire__('augur', { withdrawEther });

      store.dispatch(convertToEther());

      assert(withdrawEther.calledOnce, `didn't call 'depositEther' once as expected`);

      done();
    }
  });
});
