import testState from "test/testState";
import { UPDATE_UNIVERSE } from "modules/universe/actions/update-universe";
import reducer from "modules/universe/reducers/universe";

describe(`modules/universe/reducers/universe.js`, () => {
  const thisTestState = Object.assign({}, testState);
  test(`should update the universe object in state`, () => {
    const action = {
      type: UPDATE_UNIVERSE,
      data: {
        updatedUniverse: {
          description: "testing!",
          reportingPeriodDurationInSeconds: "12345"
        }
      }
    };
    const expectedOutput = Object.assign(
      {},
      thisTestState.universe,
      action.data.updatedUniverse
    );
    expect(reducer(thisTestState.universe, action)).toEqual(expectedOutput);
  });
});
