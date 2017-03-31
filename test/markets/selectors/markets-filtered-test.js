import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import * as mockStore from 'test/mockStore';

// TODO -- this really should be handled differently via local state for the requiring tests
let filteredMarkets;  // eslint-disable-line import/no-mutable-exports

describe(`modules/markets/selectors/markets-filtered.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const { store } = mockStore.default;

  store.selectedTopic = 'testtag';

  const mockSelectors = {
    allMarkets: [
      {
        isOpen: true,
        consensus: null,
        description: 'test 1',
        outcomes: [{
          name: 'outcome1'
        }, {
          name: 'outcome2'
        }],
        tags: [{
          name: 'testtag'
        }, {
          name: 'tag'
        }]
      }, {
        isOpen: true,
        consensus: null,
        description: 'test 2',
        outcomes: [{
          name: 'outcome3'
        }, {
          name: 'outcome4'
        }],
        tags: [{
          name: 'testtag'
        }, {
          name: 'tag'
        }]
      },
      {
        isOpen: true,
        consensus: null,
        description: 'test 3',
        outcomes: [{
          name: 'outcome3'
        }, {
          name: 'outcome4'
        }],
        tags: [{
          name: 'testtag2'
        }, {
          name: 'tag'
        }]
      }
    ]
  };

  const Markets = {
    selectMarkets: () => mockSelectors.allMarkets
  };

  const selector = proxyquire('../../../src/modules/markets/selectors/markets-filtered.js', {
    '../../../store': store,
    '../../markets/selectors/markets-all': Markets
  });

  filteredMarkets = selector.default;

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`should be able to select the correct filtered markets`, () => {
    const test = selector.default();

    const out = [{
      isOpen: true,
      consensus: null,
      description: 'test 1',
      outcomes: [{
        name: 'outcome1'
      }, {
        name: 'outcome2'
      }],
      tags: [{
        name: 'testtag'
      }, {
        name: 'tag'
      }]
    }, {
      isOpen: true,
      consensus: null,
      description: 'test 2',
      outcomes: [{
        name: 'outcome3'
      }, {
        name: 'outcome4'
      }],
      tags: [{
        name: 'testtag'
      }, {
        name: 'tag'
      }]
    }];

    assert.deepEqual(test, out, `Didn't produce the expected output object`);
  });

});

export default filteredMarkets;
