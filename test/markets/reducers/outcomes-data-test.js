// ;
// import reducer from '../../../src/modules/markets/reducers/outcomes-data';
// import { UPDATE_OUTCOME_PRICE } from '../../../src/modules/markets/actions/update-outcome-price';

/*
describe(`modules/markets/reducers/outcomes-data.js`, () => {

  it(`should update markets data`, () => {
    const outcomesData = {
      test: 'test123',
      test2: 'test456'
    };
    const expectedOutput = {
      test: 'test123',
      test2: 'test456'
    };
    const curState1 = {
      test: 'test',
      test2: 'example'
    };
    const curState2 = {
      test3: 'test789'
    };
    const expectedOutput2 = {
      test: 'test123',
      test2: 'test456',
      test3: 'test789'
    };
    assert.deepEqual(reducer(undefined, action), expectedOutput, `Didn't update Markets Data correctly with no state`);
    assert.deepEqual(reducer(curState1, action), expectedOutput, `Didn't update Markets correctly when fed a starting state`);
    assert.deepEqual(reducer(curState2, action), expectedOutput2, `Didn't update Markets that already existed`);
  });

  it(`should update the outcome price`, () => {
    const startState = {
      testMarket: {
        testOutcome: {
          price: 2
        }
      }
    };
    const price = 5;
    const outcomeId = 'testOutcome';
    const marketId = 'testMarket';
    const action = {
      type: UPDATE_OUTCOME_PRICE,
      marketId,
      outcomeId,
      price
    };
    const expectedOutput = {
      testMarket: {
        testOutcome: {
          price: 5
        }
      }
    };
    assert.deepEqual(reducer(startState, action), expectedOutput, `it didn't update the outcome price correctly.`);
    assert.deepEqual(reducer(undefined, action), {}, `given a blank state, it didn't return an empty object after not finding the outcome to modify`);
  });
});
*/
