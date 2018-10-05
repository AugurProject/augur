import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";
import { updateUniverse } from "modules/universe/actions/update-universe";

describe(`modules/universe/actions/update-universe.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);

  test("should dispatch UPDATE_UNIVERSE action", () => {
    store.dispatch(
      updateUniverse({
        currentPeriod: 20,
        currentPeriodProgress: 52,
        isReportRevealPhase: true,
        reportPeriod: 18,
        periodLength: 900
      })
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_UNIVERSE",
        data: {
          updatedUniverse: {
            currentPeriod: 20,
            currentPeriodProgress: 52,
            isReportRevealPhase: true,
            reportPeriod: 18,
            periodLength: 900
          }
        }
      }
    ]);
    store.clearActions();
  });
});
