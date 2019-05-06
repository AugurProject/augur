import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";
import { updateBlockchain } from "./update-blockchain";

describe(`modules/app/actions/update-blockchain.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);
  const action = updateBlockchain;
  test("should dispatch UPDATE_BLOCKCHAIN action", () => {
    store.dispatch(
      action({
        currentBlockNumber: 10000,
        currentBlockTimestamp: 4886718345
      })
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_BLOCKCHAIN",
        data: {
          blockchainData: {
            currentBlockNumber: 10000,
            currentBlockTimestamp: 4886718345
          }
        }
      }
    ]);
    store.clearActions();
  });
});
