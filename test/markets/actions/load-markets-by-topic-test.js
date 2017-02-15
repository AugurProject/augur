import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('modules/markets/actions/load-markets-by-topic.js', () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore();
      const AugurJS = {
        augur: {
          findMarketsWithTopic: () => {}
        }
      };
      // const mockSelectors = {
      //   branch: {
      //     id: '0xbranch1'
      //   }
      // };

      const mockLoadMarketsInfo = {};

      mockLoadMarketsInfo.loadMarketsInfo = sinon.stub().returns(() => {});

      AugurJS.augur.findMarketsWithTopic = sinon.stub();
      if (t.toTest === 'err') AugurJS.augur.findMarketsWithTopic.yields('failed with err', null);
      if (t.toTest === 'null-markets') AugurJS.augur.findMarketsWithTopic.yields(null, null);
      if (t.toTest === 'array') AugurJS.augur.findMarketsWithTopic.yields(null, ['0x1, 0x2']);
      if (t.toTest === 'empty-array') AugurJS.augur.findMarketsWithTopic.yields(null, []);

      const action = proxyquire('../../../src/modules/markets/actions/load-markets-by-topic', {
        '../../../services/augurjs': AugurJS,
        // '../../selectors': mockSelectors,
        './load-markets-info': mockLoadMarketsInfo
      });

      store.dispatch(action.loadMarketsByTopic());

      t.assertions(store.getActions(), mockLoadMarketsInfo.loadMarketsInfo);
    });
  };

  test({
    description: 'should dispatch the expected actions on err',
    toTest: 'err',
    assertions: (actions) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_TOPIC',
          hasLoadedTopic: { 'fail-err': true }
        },
        {
          type: 'UPDATE_HAS_LOADED_TOPIC',
          hasLoadedTopic: { 'fail-err': false }
        }
      ];


      assert(actions, expected, 'error was not handled as expected');
    }
  });

  test({
    description: 'should dispatch the expected actions with no error + no marketIDs returned',
    toTest: 'null-markets',
    assertions: (actions) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_TOPIC',
          hasLoadedTopic: { 'fail-err': true }
        },
        {
          type: 'UPDATE_HAS_LOADED_TOPIC',
          hasLoadedTopic: { 'fail-err': false }
        }
      ];

      assert(actions, expected, 'error was not handled as expected');
    }
  });

  test({
    description: 'should dispatch the expected actions with no error + array of returned marketIDs',
    toTest: 'array',
    assertions: (actions, loadMarketsInfo) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_TOPIC',
          hasLoadedTopic: { 'fail-err': true }
        }
      ];

      assert(actions, expected, 'returned array was not handled as expected');
      assert.isTrue(loadMarketsInfo.calledOnce);
    }
  });

  test({
    description: 'should dispatch the expected actions with no error + an empty array of marketIDs',
    toTest: 'empty-array',
    assertions: (actions, loadMarketsInfo) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_TOPIC',
          hasLoadedTopic: { 'fail-err': true }
        }
      ];

      assert(actions, expected, 'empty array was not handled as expected');
      assert.isFalse(loadMarketsInfo.called);
    }
  });
});
