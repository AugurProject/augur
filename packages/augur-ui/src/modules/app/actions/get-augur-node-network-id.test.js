import { getAugurNodeNetworkId } from "modules/app/actions/get-augur-node-network-id";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as augurModule from "services/augurjs";

jest.mock("services/augurjs.js", () => ({
  augur: {
    augurNode: {
      getSyncData: () => {}
    }
  }
}));

describe("modules/app/actions/get-augur-node-network-id.js", () => {
  let store;
  afterEach(() => {
    store.clearActions();
    jest.resetModules();
  });

  test("that augur-node network id already in state", () => {
    store = configureMockStore([thunk])({
      connection: { augurNodeNetworkId: "4" }
    });
    augurModule.augur.augurNode.mockGetSyncData = expect.toThrowErrorMatchingSnapshot();
    store.dispatch(
      getAugurNodeNetworkId((err, augurNodeNetworkId) => {
        expect(err).toBeNull();
        expect(augurNodeNetworkId).toStrictEqual("4");
        expect(store.getActions()).toHaveLength(0);
      })
    );
  });

  test("fetch network id from augur-node", () => {
    store = configureMockStore([thunk])({
      connection: { augurNodeNetworkId: null }
    });
    augurModule.augur.augurNode.getSyncData = callback =>
      callback(null, { net_version: "4" });
    store.dispatch(
      getAugurNodeNetworkId((err, augurNodeNetworkId) => {
        expect(err).toBeNull();
        expect(augurNodeNetworkId).toStrictEqual("4");
        expect(store.getActions()).toEqual([
          {
            type: "UPDATE_AUGUR_NODE_NETWORK_ID",
            data: { augurNodeNetworkId: "4" }
          }
        ]);
      })
    );
  });
});
