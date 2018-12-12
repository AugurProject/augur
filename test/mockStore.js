import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const state = Object.assign({}, testState);
const store = mockStore(state);

/**
 * Simple implementation of action (type is required)
 *
 * @return {Function}
 */
function actionCreator() {
  return jest.fn(() => ({
    type: "MOCK_ACTION"
  }));
}

export default {
  store,
  state,
  mockStore,
  actionCreator
};
