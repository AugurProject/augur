import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";
import * as action from "modules/reports/actions/update-reports";

describe(`modules/reports/actions/update-reports.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let out;
  const state = Object.assign({}, testState);
  const store = mockStore(state);

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  test(`should load reports given marketdata`, () => {
    out = [
      {
        type: "UPDATE_REPORTS",
        data: {
          reportsData: {
            test: {
              _id: "test",
              data: "test"
            },
            test2: {
              _id: "test2",
              data: "example"
            }
          }
        }
      }
    ];

    const test = {
      test: {
        _id: "test",
        data: "test"
      },
      test2: {
        _id: "test2",
        data: "example"
      }
    };

    store.dispatch(action.updateReports(test));

    expect(store.getActions()).toEqual(out);
  });
});
