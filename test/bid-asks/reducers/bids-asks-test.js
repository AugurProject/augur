import {
  assert
} from 'chai';
import testState from '../../testState';
import {
  UPDATE_BIDSASKS_DATA
} from '../../../src/modules/bids-asks/actions/update-bids-asks';
import reducer from '../../../src/modules/bids-asks/reducers/bids-asks';

describe(`modules/bids-asks/reducers/bids-asks.js`, () => {
  let action;
  let thisTestState = Object.assign({}, testState);
  it(`should update bids-asks data when UPDATE_BIDSASKS_DATA is fired`, () => {
    action = {
      type: UPDATE_BIDSASKS_DATA,
      bidsAsksData: {
        test: {
          id: 'test',
          marketID: 'testMarketID',
          outcomeID: 'testOutcomeID',
          action: 'executed',
          accountID: thisTestState.loginAccount.id,
          bidOrAsk: 'ask',
          numShares: 100,
          limitPrice: 5.0
        }
      }
    };
    console.log(reducer(thisTestState.bidsAsks, action));
    // failing this on purpose for now, need to do more research on bids-asks
    assert.equal(3, 5);
  });

});
