import {
  assert
} from 'chai';
import * as selector from '../../../src/modules/markets/selectors/filtered-markets';

describe(`modules/markets/selectors/filtered-markets.js`, () => {

  it(`should be able to select the correct filtered markets`, () => {
    let keywords = 'test tag testtag';

    let markets = [{
      isOpen: true,
      description: 'test 1',
      outcomes: [{
        name: 'outcome1'
      }, {
        name: 'outcome2'
      }],
      tags: ['testtag', 'tag']
    }, {
      isOpen: true,
      description: 'test 2',
      outcomes: [{
        name: 'outcome3'
      }, {
        name: 'outcome4'
      }],
      tags: ['testtag', 'tag']
    }];

    let selectedFilters = {
      isOpen: true
    };

    let test = selector.selectFilteredMarkets(markets, keywords, selectedFilters);

    let out = [{
      isOpen: true,
      description: 'test 1',
      outcomes: [{
        name: 'outcome1'
      }, {
        name: 'outcome2'
      }],
      tags: ['testtag', 'tag']
    }, {
      isOpen: true,
      description: 'test 2',
      outcomes: [{
        name: 'outcome3'
      }, {
        name: 'outcome4'
      }],
      tags: ['testtag', 'tag']
    }];

    assert.deepEqual(test, out, `Didn't produce the expected output object`);
  });

});
